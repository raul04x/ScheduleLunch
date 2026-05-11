'use client';
import type { ActivityEvent } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface Props { events: ActivityEvent[] }

const icons: Record<ActivityEvent['type'], string> = {
  UserReserved: '🟢',
  UserCancelled: '🟡',
  SlotCreated: '🔵',
  SlotDeleted: '🔴',
};

export function ActivityFeed({ events }: Props) {
  const { t } = useTranslation();

  if (events.length === 0)
    return <p className="text-gray-600 text-sm">{t.noRecentActivity}</p>;

  function getMessage(e: ActivityEvent): string {
    switch (e.type) {
      case 'UserReserved': return t.activityReserved(e.userName, e.slotLabel, e.attendeeCount, e.capacity);
      case 'UserCancelled': return t.activityCancelled(e.userName, e.slotLabel, e.attendeeCount, e.capacity);
      case 'SlotCreated': return t.activitySlotCreated(e.slotLabel, e.capacity);
      case 'SlotDeleted': return t.activitySlotDeleted(e.slotLabel);
    }
  }

  return (
    <ul className="flex flex-col gap-1">
      {events.map((e, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span>{icons[e.type]}</span>
          <span>{getMessage(e)}</span>
          <span className="text-gray-600 text-xs ml-auto">{e.date}</span>
        </li>
      ))}
    </ul>
  );
}
