import type { TimeSlotDto } from '@/lib/types';

interface Props {
  slot: TimeSlotDto;
  onToggle: (slot: TimeSlotDto) => void;
  loading: boolean;
}

export function SlotCell({ slot, onToggle, loading }: Props) {
  const isFull = slot.attendeeCount >= slot.capacity;
  const reserved = slot.isReservedByCurrentUser;

  let bg = 'bg-gray-800 hover:bg-gray-700 cursor-pointer';
  if (reserved) bg = 'bg-indigo-900 border border-indigo-500 cursor-pointer';
  if (isFull && !reserved) bg = 'bg-gray-900 cursor-not-allowed opacity-60';
  if (loading) bg += ' opacity-50 pointer-events-none';

  return (
    <button
      onClick={() => (!isFull || reserved) ? onToggle(slot) : undefined}
      disabled={loading || (isFull && !reserved)}
      className={`rounded p-2 text-center text-xs flex flex-col gap-0.5 transition-colors ${bg}`}>
      <span className="text-gray-300 font-medium">{slot.label}</span>
      <span className={reserved ? 'text-indigo-300' : isFull ? 'text-red-400' : 'text-gray-400'}>
        {slot.attendeeCount}/{slot.capacity}
        {reserved && ' ✓'}
        {isFull && !reserved && ' 🔒'}
      </span>
    </button>
  );
}
