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
import type { TimeSlotDto } from '@/lib/types';

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [form, setForm] = useState({ date: '', label: '', startTime: '', endTime: '', capacity: 5 });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toast, setToast] = useState('');
  const token = getToken() ?? '';
  const { t } = useTranslation();

  const loadSlots = useCallback(async () => {
    try {
      const data = await api.schedule.getWeek(token);
      setSlots(data);
    } catch {
      setError(t.errorGeneric);
    }
  }, [token, t]);

  useEffect(() => { loadSlots(); }, [loadSlots]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: field === 'capacity' ? Number(e.target.value) : e.target.value }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setFormError('');
    if (form.startTime && form.endTime && form.startTime >= form.endTime) {
      setFormError(t.timeRangeError);
      return;
    }
    try {
      const slot = await api.schedule.createSlot({
        date: form.date,
        label: form.label,
        startTime: form.startTime + ':00',
        endTime: form.endTime + ':00',
        capacity: form.capacity,
      }, token);
      setSlots(prev => [...prev, slot]);
      setForm({ date: '', label: '', startTime: '', endTime: '', capacity: 5 });
      setSheetOpen(false);
      setToast(t.toastSlotCreated);
    } catch {
      setFormError(t.errorGeneric);
    }
  }

  async function confirmDelete() {
    if (!deletingId) return;
    try {
      await api.schedule.deleteSlot(deletingId, token);
      setSlots(prev => prev.filter(s => s.id !== deletingId));
    } catch {
      setError(t.errorGeneric);
    } finally {
      setDeletingId(null);
    }
  }

  const inputDate = 'bg-[var(--color-bg-subtle)] text-[var(--color-text)] px-3 py-2 rounded border border-[var(--color-border)] text-sm';

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{t.slotManagement}</h1>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {/* Desktop: inline form */}
      <form onSubmit={create} className="hidden md:grid bg-[var(--color-surface)] p-4 rounded-xl border border-[var(--color-border)] mb-8 grid-cols-2 gap-3">
        <h2 className="col-span-2 text-sm text-[var(--color-text-muted)] font-medium">{t.newSlot}</h2>
        <input type="date" value={form.date} onChange={set('date')} required className={inputDate} />
        <Input value={form.label} onChange={set('label')} placeholder={t.slotLabelPlaceholder} required />
        <input type="time" value={form.startTime} onChange={set('startTime')} required className={inputDate} />
        <input type="time" value={form.endTime} onChange={set('endTime')} required className={inputDate} />
        <Input type="number" value={String(form.capacity)} onChange={set('capacity')} min={1} max={50} required />
        <Button type="submit" variant="gold">{t.createSlot}</Button>
        {formError && <p className="col-span-2 text-xs text-red-500">{formError}</p>}
      </form>

      {/* Slot list */}
      <ul className="flex flex-col gap-2">
        {slots.map(s => (
          <li key={s.id}>
            <Card className="p-3 flex items-center justify-between">
              <div className="text-sm">
                <span className="text-[var(--color-text)] font-medium">{s.label}</span>
                <span className="text-[var(--color-text-muted)] ml-2">{s.date}</span>
                <span className="text-[var(--color-text-muted)] ml-2">{t.capacityAbbr} {s.capacity}</span>
                <span className="text-[var(--color-text-muted)] ml-2">{s.attendeeCount} {t.reservationsLabel}</span>
              </div>
              <Button variant="danger" size="sm" onClick={() => setDeletingId(s.id)}>{t.deleteAction}</Button>
            </Card>
          </li>
        ))}
      </ul>

      {/* Mobile: FAB */}
      <button
        onClick={() => setSheetOpen(true)}
        className="fixed bottom-20 right-4 md:hidden w-14 h-14 rounded-full bg-[var(--color-accent)] text-white text-2xl shadow-[var(--shadow-elevated)] flex items-center justify-center z-30"
        aria-label={t.newSlot}
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
            <h3 className="font-bold text-[var(--color-text)]">{t.newSlot}</h3>
            <input type="date" value={form.date} onChange={set('date')} required
              className={`w-full ${inputDate} py-2.5 rounded-lg`} />
            <Input value={form.label} onChange={set('label')} placeholder={t.slotLabelPlaceholder} required />
            <div className="flex gap-3">
              <input type="time" value={form.startTime} onChange={set('startTime')} required
                className={`flex-1 ${inputDate} py-2.5 rounded-lg`} />
              <input type="time" value={form.endTime} onChange={set('endTime')} required
                className={`flex-1 ${inputDate} py-2.5 rounded-lg`} />
            </div>
            <Input type="number" value={String(form.capacity)} onChange={set('capacity')} min={1} max={50} required />
            {formError && <p className="text-xs text-red-500">{formError}</p>}
            <Button type="submit" variant="gold" className="w-full">{t.createSlot}</Button>
          </form>
        </div>
      )}

      <ConfirmDialog
        open={deletingId !== null}
        onConfirm={confirmDelete}
        onCancel={() => setDeletingId(null)}
      />

      {toast && <Toast message={toast} onDone={() => setToast('')} />}
    </div>
  );
}
