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
    return <p className="text-[var(--color-text-muted)] text-sm">{t.noRecentActivity}</p>;

  function getMessage(e: ActivityEvent): string {
    switch (e.type) {
      case 'UserReserved': return t.activityReserved(e.userName, e.slotLabel, e.attendeeCount, e.capacity);
      case 'UserCancelled': return t.activityCancelled(e.userName, e.slotLabel, e.attendeeCount, e.capacity);
      case 'SlotCreated': return t.activitySlotCreated(e.slotLabel, e.capacity);
      case 'SlotDeleted': return t.activitySlotDeleted(e.slotLabel);
    }
  }

  return (
    <ul className="flex flex-col">
      {events.map((e, i) => (
        <li
          key={i}
          className="flex items-start gap-2 py-2 border-b border-[var(--color-border)] last:border-0"
        >
          <span>{icons[e.type]}</span>
          <span className="text-xs text-[var(--color-text-muted)] flex-1">{getMessage(e)}</span>
          <span className="text-[var(--color-text-muted)] text-xs opacity-60 ml-auto shrink-0">{e.date}</span>
        </li>
      ))}
    </ul>
  );
}
