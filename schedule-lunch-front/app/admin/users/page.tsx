'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { UserAdminDto, UserRole } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserAdminDto[]>([]);
  const token = getToken() ?? '';

  useEffect(() => { api.admin.getUsers(token).then(setUsers); }, [token]);

  async function updateRole(userId: string, role: UserRole) {
    await api.admin.updateRole(userId, role, token);
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role } : u));
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-white mb-6">Gestion de Usuarios</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-800">
            <th className="pb-2">Usuario</th>
            <th className="pb-2">Email</th>
            <th className="pb-2">Rol</th>
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
    </div>
  );
}
