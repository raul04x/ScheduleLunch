'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { GroupDto } from '@/lib/types';

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const token = getToken() ?? '';

  useEffect(() => { api.groups.getAll(token).then(setGroups); }, [token]);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const g = await api.groups.create(name, desc || null, token);
    setGroups(prev => [...prev, g]);
    setName(''); setDesc('');
  }

  async function remove(id: string) {
    await api.groups.delete(id, token);
    setGroups(prev => prev.filter(g => g.id !== id));
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-white mb-6">Grupos</h1>
      <form onSubmit={create} className="flex flex-col gap-2 mb-8 bg-gray-900 p-4 rounded-xl border border-gray-800">
        <h2 className="text-sm text-gray-400 font-medium mb-1">Nuevo grupo</h2>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Descripcion (opcional)"
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium">
          Crear grupo
        </button>
      </form>
      <ul className="flex flex-col gap-2">
        {groups.map(g => (
          <li key={g.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800">
            <div>
              <p className="text-white text-sm font-medium">{g.name}</p>
              {g.description && <p className="text-gray-500 text-xs">{g.description}</p>}
            </div>
            <button onClick={() => remove(g.id)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
