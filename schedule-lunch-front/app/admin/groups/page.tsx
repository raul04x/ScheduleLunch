'use client';

import { useCallback, useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Toast } from '@/components/ui/Toast';
import type { GroupDto, MemberDto, UserAdminDto } from '@/lib/types';

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [membersMap, setMembersMap] = useState<Record<string, MemberDto[]>>({});
  const [loadingGroupId, setLoadingGroupId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<UserAdminDto[] | null>(null);
  const [addingToGroup, setAddingToGroup] = useState<string | null>(null);
  const [addUserId, setAddUserId] = useState('');
  const [error, setError] = useState('');
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const token = getToken() ?? '';
  const { t } = useTranslation();

  const loadGroups = useCallback(async () => {
    try {
      const data = await api.groups.getAll(token);
      setGroups(data);
    } catch {
      setError(t.errorGeneric);
    }
  }, [token, t]);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    try {
      const g = await api.groups.create(name, desc || null, token);
      setGroups(prev => [...prev, g]);
      setName(''); setDesc('');
      setSheetOpen(false);
      setToast(t.toastGroupCreated);
    } catch {
      setError(t.errorGeneric);
    }
  }

  async function confirmDelete() {
    if (!deletingGroupId) return;
    try {
      await api.groups.delete(deletingGroupId, token);
      setGroups(prev => prev.filter(g => g.id !== deletingGroupId));
      if (expandedGroupId === deletingGroupId) setExpandedGroupId(null);
    } catch {
      setError(t.errorGeneric);
    } finally {
      setDeletingGroupId(null);
    }
  }

  async function toggleMembers(groupId: string) {
    if (expandedGroupId === groupId) { setExpandedGroupId(null); return; }
    setExpandedGroupId(groupId);
    if (!membersMap[groupId]) {
      setLoadingGroupId(groupId);
      try {
        const members = await api.groups.getMembers(groupId, token);
        setMembersMap(prev => ({ ...prev, [groupId]: members }));
      } catch {
        setError(t.errorGeneric);
      } finally {
        setLoadingGroupId(null);
      }
    }
  }

  async function removeMember(userId: string, groupId: string) {
    try {
      await api.groups.removeMember(userId, token);
      setMembersMap(prev => ({
        ...prev,
        [groupId]: (prev[groupId] ?? []).filter(m => m.userId !== userId),
      }));
    } catch {
      setError(t.errorGeneric);
    }
  }

  async function openAddMember(groupId: string) {
    setAddingToGroup(groupId);
    setAddUserId('');
    if (!allUsers) {
      try {
        const users = await api.admin.getUsers(token);
        setAllUsers(users);
      } catch {
        setError(t.errorGeneric);
      }
    }
  }

  async function confirmAddMember(groupId: string) {
    if (!addUserId) return;
    try {
      await api.admin.assignGroup(addUserId, groupId, token);
      const members = await api.groups.getMembers(groupId, token);
      setMembersMap(prev => ({ ...prev, [groupId]: members }));
      setAddingToGroup(null);
      setAddUserId('');
    } catch {
      setError(t.errorGeneric);
    }
  }

  const selectClass = 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] rounded-lg px-3 py-2 text-sm border border-[var(--color-border)] flex-1';

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{t.groupsTitle}</h1>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Desktop: inline form */}
      <form onSubmit={create} className="hidden md:flex flex-col gap-3 mb-8 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-sm text-[var(--color-text-muted)] font-medium">{t.newGroup}</h2>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.groupNameFieldPlaceholder} required />
        <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t.groupDescFieldPlaceholder} />
        <Button type="submit" variant="gold">{t.createGroup}</Button>
      </form>

      {/* Group list */}
      <ul className="flex flex-col gap-3">
        {groups.map(g => (
          <li key={g.id}>
            <Card className="overflow-hidden">
              <div className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-[var(--color-text)] text-sm font-medium">{g.name}</p>
                  {g.description && <p className="text-[var(--color-text-muted)] text-xs mt-0.5">{g.description}</p>}
                  {membersMap[g.id] && (
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">
                      {membersMap[g.id].length} {t.membersSection.toLowerCase()}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => toggleMembers(g.id)}>
                    {expandedGroupId === g.id ? t.hideMembers : t.viewMembers}
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => setDeletingGroupId(g.id)}>
                    {t.deleteAction}
                  </Button>
                </div>
              </div>

              {expandedGroupId === g.id && (
                <div className="border-t border-[var(--color-border)] p-3 bg-[var(--color-bg-subtle)] space-y-2">
                  <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-2">
                    {t.membersSection}
                  </p>
                  {loadingGroupId === g.id ? (
                    <p className="text-xs text-[var(--color-text-muted)] py-2">...</p>
                  ) : (
                    <>
                      {(membersMap[g.id] ?? []).length === 0 && (
                        <p className="text-xs text-[var(--color-text-muted)] py-1">{t.noMembers}</p>
                      )}
                      {(membersMap[g.id] ?? []).map(m => (
                        <div key={m.userId} className="flex items-center justify-between py-1.5 px-2 rounded-lg bg-[var(--color-surface)]">
                          <div>
                            <span className="text-sm text-[var(--color-text)] font-medium">{m.username}</span>
                            {m.fullName && <span className="text-xs text-[var(--color-text-muted)] ml-2">{m.fullName}</span>}
                          </div>
                          <Button
                            variant="ghost" size="sm"
                            onClick={() => removeMember(m.userId, g.id)}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            {t.removeFromGroup}
                          </Button>
                        </div>
                      ))}

                      {addingToGroup === g.id ? (
                        <div className="flex items-center gap-2 pt-1">
                          <select value={addUserId} onChange={e => setAddUserId(e.target.value)} className={selectClass}>
                            <option value="">{t.selectUserPlaceholder}</option>
                            {(allUsers ?? [])
                              .filter(u => !(membersMap[g.id] ?? []).some(m => m.userId === u.id))
                              .map(u => (
                                <option key={u.id} value={u.id}>
                                  {u.username}{u.fullName ? ` — ${u.fullName}` : ''}
                                </option>
                              ))}
                          </select>
                          <Button size="sm" onClick={() => confirmAddMember(g.id)} disabled={!addUserId}>
                            {t.addMember}
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingToGroup(null)}>✕</Button>
                        </div>
                      ) : (
                        <button
                          onClick={() => openAddMember(g.id)}
                          className="text-xs text-[var(--color-accent)] hover:underline mt-1 block"
                        >
                          + {t.addMember}
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>

      {/* Mobile: FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 md:hidden w-14 h-14 rounded-full bg-[var(--color-accent)] text-white text-2xl shadow-[var(--shadow-elevated)] flex items-center justify-center z-30"
        aria-label={t.newGroup}
      >
        +
      </button>

      {/* Mobile: bottom sheet */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setSheetOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <form
            onSubmit={create}
            className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-2xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto" />
            <h3 className="font-bold text-[var(--color-text)]">{t.newGroup}</h3>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.groupNameFieldPlaceholder} required />
            <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t.groupDescFieldPlaceholder} />
            <Button type="submit" variant="gold" className="w-full">{t.createGroup}</Button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={deletingGroupId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingGroupId(null)}
      />

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
