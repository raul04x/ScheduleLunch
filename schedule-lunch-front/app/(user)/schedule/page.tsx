'use client';
import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { startConnection } from '@/lib/signalr';
import { useTranslation } from '@/lib/i18n';
import { WeeklyGrid } from '@/components/schedule/WeeklyGrid';
import { ActivityFeed } from '@/components/schedule/ActivityFeed';
import type { TimeSlotDto, ActivityEvent } from '@/lib/types';

export default function SchedulePage() {
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [activity, setActivity] = useState<ActivityEvent[]>([]);
  const [loadingSlotId, setLoadingSlotId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { t } = useTranslation();

  const token = getToken() ?? '';

  const fetchSlots = useCallback(async () => {
    try {
      const data = await api.schedule.getWeek(token);
      setSlots(data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.errorLoadingSlots);
    }
  }, [token, t]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  useEffect(() => {
    if (!token) return;
    let conn: Awaited<ReturnType<typeof startConnection>>;

    startConnection(token).then(c => {
      conn = c;
      const addEvent = (type: ActivityEvent['type']) => (data: Omit<ActivityEvent, 'type'>) => {
        setActivity(prev => [{ ...data, type }, ...prev].slice(0, 20));
        fetchSlots();
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
  }, [token, fetchSlots]);

  async function handleToggle(slot: TimeSlotDto) {
    setLoadingSlotId(slot.id);
    try {
      if (slot.isReservedByCurrentUser) {
        const updated = await api.schedule.cancel(slot.id, token);
        setSlots(prev => prev.map(s => s.id === updated.id ? updated : s));
      } else {
        const updated = await api.schedule.reserve(slot.id, token);
        setSlots(prev => prev.map(s => s.id === updated.id ? updated : s));
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : t.errorUpdatingSlot);
    } finally {
      setLoadingSlotId(null);
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">{t.currentWeek}</h1>
      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
      <WeeklyGrid slots={slots} onToggle={handleToggle} loadingSlotId={loadingSlotId} />
      <div className="mt-8 bg-gray-900 rounded-xl p-4 border border-gray-800">
        <h2 className="text-sm font-medium text-gray-400 mb-3">{t.recentActivity}</h2>
        <ActivityFeed events={activity} />
      </div>
    </div>
  );
}
