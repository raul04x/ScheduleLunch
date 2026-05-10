import type { ActivityEvent } from '@/lib/types';

interface Props { events: ActivityEvent[] }

const labels: Record<ActivityEvent['type'], string> = {
  UserReserved: '🟢',
  UserCancelled: '🟡',
  SlotCreated: '🔵',
  SlotDeleted: '🔴',
};

const messages: Record<ActivityEvent['type'], (e: ActivityEvent) => string> = {
  UserReserved: e => `${e.userName} reservo ${e.slotLabel} (${e.attendeeCount}/${e.capacity})`,
  UserCancelled: e => `${e.userName} cancelo ${e.slotLabel} (${e.attendeeCount}/${e.capacity})`,
  SlotCreated: e => `Nuevo slot ${e.slotLabel} creado (cap. ${e.capacity})`,
  SlotDeleted: e => `Slot ${e.slotLabel} eliminado`,
};

export function ActivityFeed({ events }: Props) {
  if (events.length === 0)
    return <p className="text-gray-600 text-sm">Sin actividad reciente.</p>;

  return (
    <ul className="flex flex-col gap-1">
      {events.map((e, i) => (
        <li key={i} className="text-sm text-gray-300 flex gap-2">
          <span>{labels[e.type]}</span>
          <span>{messages[e.type](e)}</span>
          <span className="text-gray-600 text-xs ml-auto">{e.date}</span>
        </li>
      ))}
    </ul>
  );
}
