'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { startConnection } from '@/lib/signalr';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { UserAdminDto, UserRole, GroupDto } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const token = getToken() ?? '';
  const { t } = useTranslation();

  useEffect(() => {
    api.admin.getUsers(token).then(setUsers);
    api.groups.getAll(token).then(setGroups);
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let conn: Awaited<ReturnType<typeof startConnection>>;

    startConnection(token).then(c => {
      conn = c;
      conn.on('UserPendingApproval', (user: UserAdminDto) => {
        setUsers(prev => prev.some(u => u.id === user.id) ? prev : [...prev, user]);
      });
    });

    return () => { conn?.off('UserPendingApproval'); };
  }, [token]);

  const pending = users.filter(u => u.membershipStatus === 'Pending');

  async function approveMember(user: UserAdminDto) {
    await api.groups.approveMember(user.id, token);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, membershipStatus: 'Approved' } : u));
  }

  async function rejectMember(user: UserAdminDto) {
    await api.groups.removeMember(user.id, token);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  }

  async function updateRole(userId: string, role: UserRole) {
    await api.admin.updateRole(userId, role, token);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  async function assignGroup(userId: string, groupId: string) {
    if (!groupId) return;
    setAssigningId(userId);
    try {
      await api.admin.assignGroup(userId, groupId, token);
      setUsers(prev => prev.map(u => u.id === userId
        ? { ...u, groupId, membershipStatus: 'Approved' }
        : u));
    } finally {
      setAssigningId(null);
    }
  }

  function groupName(groupId: string | null): string {
    if (!groupId) return t.noGroup;
    return groups.find(g => g.id === groupId)?.name ?? t.noGroup;
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Pending approvals */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-text)] mb-4 flex items-center gap-2">
          {t.pendingApprovals}
          {pending.length > 0 && (
            <Badge variant="accent">{pending.length}</Badge>
          )}
        </h2>

        {pending.length === 0 ? (
          <p className="text-[var(--color-text-muted)] text-sm">{t.noPendingRequests}</p>
        ) : (
          <>
            {/* Desktop: table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                    <th className="pb-2">{t.userCol}</th>
                    <th className="pb-2">{t.fullNameCol}</th>
                    <th className="pb-2">{t.groupCol}</th>
                    <th className="pb-2">{t.actionsCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.map(u => (
                    <tr key={u.id} className="border-b border-[var(--color-border)]">
                      <td className="py-3 text-[var(--color-text)]">{u.username}</td>
                      <td className="py-3 text-[var(--color-text-muted)]">{u.fullName}</td>
                      <td className="py-3 text-[var(--color-text-muted)] text-xs">{groupName(u.groupId)}</td>
                      <td className="py-3 flex gap-2">
                        <Button size="sm" onClick={() => approveMember(u)}>{t.approve}</Button>
                        <Button size="sm" variant="danger" onClick={() => rejectMember(u)}>{t.reject}</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: cards */}
            <div className="md:hidden space-y-3">
              {pending.map(u => (
                <Card key={u.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[var(--color-accent-dim)] flex items-center justify-center text-[var(--color-accent)] font-bold text-sm">
                        {(u.fullName?.[0] ?? u.username[0]).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-text)] text-sm">{u.fullName || u.username}</p>
                        <p className="text-xs text-[var(--color-text-muted)]">{u.email}</p>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{groupName(u.groupId)}</p>
                      </div>
                    </div>
                    <Badge variant="gold">{t.statusPending}</Badge>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" size="sm" className="flex-1" onClick={() => approveMember(u)}>
                      {t.approve}
                    </Button>
                    <Button variant="danger" size="sm" className="flex-1" onClick={() => rejectMember(u)}>
                      {t.reject}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </section>

      {/* All users */}
      <section>
        <h2 className="text-base font-semibold text-[var(--color-text)] mb-4">{t.allUsers}</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                <th className="pb-2">{t.userCol}</th>
                <th className="pb-2 hidden md:table-cell">{t.emailCol}</th>
                <th className="pb-2">{t.roleCol}</th>
                <th className="pb-2">{t.groupCol}</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-[var(--color-border)]">
                  <td className="py-3 text-[var(--color-text)]">
                    <div>{u.username}</div>
                    <div className="text-xs text-[var(--color-text-muted)] md:hidden">{u.email}</div>
                  </td>
                  <td className="py-3 text-[var(--color-text-muted)] hidden md:table-cell">{u.email}</td>
                  <td className="py-3">
                    <select
                      value={u.role}
                      onChange={e => updateRole(u.id, e.target.value as UserRole)}
                      className="bg-[var(--color-bg-subtle)] text-[var(--color-text)] rounded px-2 py-1 text-xs border border-[var(--color-border)]"
                    >
                      <option value="User">User</option>
                      <option value="GroupAdmin">GroupAdmin</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                  </td>
                  <td className="py-3">
                    <select
                      value={u.groupId ?? ''}
                      disabled={assigningId === u.id}
                      onChange={e => assignGroup(u.id, e.target.value)}
                      className="bg-[var(--color-bg-subtle)] text-[var(--color-text)] rounded px-2 py-1 text-xs border border-[var(--color-border)] disabled:opacity-50 max-w-[140px]"
                    >
                      <option value="">{t.noGroup}</option>
                      {groups.map(g => (
                        <option key={g.id} value={g.id}>{g.name}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
