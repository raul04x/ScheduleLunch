import type { TimeSlotDto } from '@/lib/types';

interface Props {
  slot: TimeSlotDto;
  onToggle: (slot: TimeSlotDto) => void;
  loading: boolean;
}

export function SlotCell({ slot, onToggle, loading }: Props) {
  const isFull = slot.attendeeCount >= slot.capacity;
  const reserved = slot.isReservedByCurrentUser;

  let className = 'rounded-xl p-2 text-center text-xs flex flex-col gap-0.5 transition-colors w-full h-12';

  if (reserved) {
    className += ' border border-[var(--color-accent)] bg-[var(--color-accent-dim)] cursor-pointer';
  } else if (isFull) {
    className += ' border border-[var(--color-border)] bg-[var(--color-bg-subtle)] opacity-60 cursor-not-allowed';
  } else {
    className += ' border border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-dim)] cursor-pointer';
  }

  if (loading) className += ' opacity-50 pointer-events-none';

  return (
    <button
      onClick={() => (!isFull || reserved) ? onToggle(slot) : undefined}
      disabled={loading || (isFull && !reserved)}
      className={className}
    >
      <span className="text-[var(--color-text)] font-medium truncate">{slot.label}</span>
      <span className={
        reserved
          ? 'text-[var(--color-accent)]'
          : isFull
          ? 'text-red-500'
          : 'text-[var(--color-text-muted)]'
      }>
        {slot.attendeeCount}/{slot.capacity}
        {reserved && ' ✓'}
        {isFull && !reserved && ' 🔒'}
      </span>
    </button>
  );
}
