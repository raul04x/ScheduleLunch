'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { GroupDto } from '@/lib/types';

export default function AdminGroupsPage() {
  const [groups, setGroups] = useState<GroupDto[]>([]);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const token = getToken() ?? '';
  const { t } = useTranslation();

  useEffect(() => { api.groups.getAll(token).then(setGroups); }, [token]);

  async function create(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const g = await api.groups.create(name, desc || null, token);
    setGroups(prev => [...prev, g]);
    setName(''); setDesc('');
    setSheetOpen(false);
  }

  async function remove(id: string) {
    await api.groups.delete(id, token);
    setGroups(prev => prev.filter(g => g.id !== id));
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{t.groupsTitle}</h1>

      {/* Desktop: inline form */}
      <form onSubmit={create} className="hidden md:flex flex-col gap-3 mb-8 bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)]">
        <h2 className="text-sm text-[var(--color-text-muted)] font-medium">{t.newGroup}</h2>
        <Input value={name} onChange={e => setName(e.target.value)} placeholder={t.groupNameFieldPlaceholder} required />
        <Input value={desc} onChange={e => setDesc(e.target.value)} placeholder={t.groupDescFieldPlaceholder} />
        <Button type="submit" variant="gold">{t.createGroup}</Button>
      </form>

      {/* Group list */}
      <ul className="flex flex-col gap-2">
        {groups.map(g => (
          <li key={g.id}>
            <Card className="p-3 flex items-center justify-between">
              <div>
                <p className="text-[var(--color-text)] text-sm font-medium">{g.name}</p>
                {g.description && <p className="text-[var(--color-text-muted)] text-xs">{g.description}</p>}
              </div>
              <Button variant="danger" size="sm" onClick={() => remove(g.id)}>{t.deleteAction}</Button>
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
    </div>
  );
}
