'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { startConnection } from '@/lib/signalr';
import type { UserAdminDto, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const token = getToken() ?? '';

  useEffect(() => {
    api.admin.getUsers(token).then(setUsers);
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
    if (!user.groupId) return;
    await api.groups.approveMember(user.id, token);
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, membershipStatus: 'Approved' } : u));
  }

  async function rejectMember(user: UserAdminDto) {
    if (!user.groupId) return;
    await api.groups.removeMember(user.id, token);
    setUsers(prev => prev.filter(u => u.id !== user.id));
  }

  async function updateRole(userId: string, role: UserRole) {
    await api.admin.updateRole(userId, role, token);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Pending approvals */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">
          Pending Approvals
          {pending.length > 0 && (
            <span className="ml-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {pending.length}
            </span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending requests.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b border-gray-800">
                <th className="pb-2">User</th>
                <th className="pb-2">Full name</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map(u => (
                <tr key={u.id} className="border-b border-gray-800/50">
                  <td className="py-3 text-white">{u.username}</td>
                  <td className="py-3 text-gray-400">{u.fullName}</td>
                  <td className="py-3 flex gap-2">
                    <button
                      onClick={() => approveMember(u)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs px-3 py-1 rounded transition-colors">
                      Approve
                    </button>
                    <button
                      onClick={() => rejectMember(u)}
                      className="bg-gray-700 hover:bg-red-700 text-white text-xs px-3 py-1 rounded transition-colors">
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* All users */}
      <section>
        <h2 className="text-base font-semibold text-white mb-4">All Users</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-800">
              <th className="pb-2">User</th>
              <th className="pb-2">Email</th>
              <th className="pb-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} className="border-b border-gray-800/50">
                <td className="py-3 text-white">{u.username}</td>
                <td className="py-3 text-gray-400">{u.email}</td>
                <td className="py-3">
                  <select value={u.role}
                    onChange={e => updateRole(u.id, e.target.value as UserRole)}
                    className="bg-gray-800 text-white rounded px-2 py-1 text-xs border border-gray-700">
                    <option value="User">User</option>
                    <option value="GroupAdmin">GroupAdmin</option>
                    <option value="SuperAdmin">SuperAdmin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
