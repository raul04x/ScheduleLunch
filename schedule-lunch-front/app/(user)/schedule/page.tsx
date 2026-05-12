'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { startConnection } from '@/lib/signalr';
import { useTranslation } from '@/lib/i18n';
import { WeeklyGrid } from '@/components/schedule/WeeklyGrid';
import { ActivityFeed } from '@/components/schedule/ActivityFeed';
import { getMondayOf } from '@/lib/weekDates';
import type { TimeSlotDto, ActivityEvent } from '@/lib/types';

export default function SchedulePage() {
  const [monday, setMonday] = useState(() => getMondayOf(new Date()));
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();
  const token = getToken() ?? '';

  const fetchSlots = useCallback(async (ref: Date) => {
    try {
      const date = ref.toISOString().slice(0, 10);
      const data = await api.schedule.getWeek(token, date);
      setSlots(data);
    } catch {
      setError(t.errorLoadingSlots);
    }
  }, [token, t]);

  useEffect(() => { fetchSlots(monday); }, [monday, fetchSlots]);

  useEffect(() => {
    if (!token) return;
    let conn: Awaited<ReturnType<typeof startConnection>>;

    startConnection(token).then(c => {
      conn = c;
      const addEvent = (type: ActivityEvent['type']) => (data: Omit<ActivityEvent, 'type'>) => {
        setActivity(prev => [{ ...data, type }, ...prev].slice(0, 20));
        fetchSlots(monday);
      };
      conn.on('UserReserved', addEvent('UserReserved'));
      conn.on('UserCancelled', addEvent('UserCancelled'));
      conn.on('SlotCreated', addEvent('SlotCreated'));
      conn.on('SlotDeleted', addEvent('SlotDeleted'));
    });

    return () => {
      conn?.off('UserReserved');
      conn?.off('UserCancelled');
      conn?.off('SlotCreated');
      conn?.off('SlotDeleted');
    };
  }, [token, monday, fetchSlots]);

  async function handleToggle(slot: TimeSlotDto) {
    setLoadingSlotId(slot.id);
    try {
      const updated = slot.isReservedByCurrentUser
        ? await api.schedule.cancel(slot.id, token)
        : await api.schedule.reserve(slot.id, token);
      setSlots(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch {
      setError(t.errorUpdatingSlot);
    } finally {
      setLoadingSlotId(null);
    }
  }

  function shiftWeek(delta: number) {
    setMonday(prev => {
      const next = new Date(prev);
      next.setDate(prev.getDate() + delta * 7);
      return next;
    });
  }

  return (
    <div className="max-w-5xl mx-auto">
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <WeeklyGrid
        slots={slots}
        onToggle={handleToggle}
        loadingSlotId={loadingSlotId}
        monday={monday}
        onPrevWeek={() => shiftWeek(-1)}
        onNextWeek={() => shiftWeek(1)}
      />

      <div className="mt-8 bg-[var(--color-surface)] rounded-xl p-4 border border-[var(--color-border)]">
        <h2 className="text-sm font-medium text-[var(--color-text-muted)] mb-3">{t.recentActivity}</h2>
        <ActivityFeed events={activity} />
      </div>
    </div>
  );
}
