'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import type { TimeSlotDto } from '@/lib/types';
import { getWeekDates, getTodayDate } from '@/lib/weekDates';

interface Props {
  slots: TimeSlotDto[];
  onToggle: (slot: TimeSlotDto) => void;
  loadingSlotId: string | null;
}

function formatDate(iso: string, locale: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
}

export function DayView({ slots, onToggle, loadingSlotId }: Props) {
  const { t, locale } = useTranslation();
  const weekDates = getWeekDates();
  const today = getTodayDate();

  const todayIndex = weekDates.indexOf(today);
  const [dayIndex, setDayIndex] = useState(todayIndex >= 0 ? todayIndex : 0);

  const currentDate = weekDates[dayIndex];
  const daySlots = slots.filter(s => s.date === currentDate);

  return (
    <div className="flex flex-col gap-4">
      {/* Day navigator */}
      <div className="flex items-center justify-between px-2">
        <button
          onClick={() => setDayIndex(i => Math.max(0, i - 1))}
          disabled={dayIndex === 0}
          aria-label={t.days[Math.max(0, dayIndex - 1)]}
          className="p-2 rounded-lg disabled:opacity-30 text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] text-xl leading-none"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold capitalize text-[var(--color-text)]">
            {formatDate(currentDate, locale)}
          </p>
          {currentDate === today && (
            <span className="text-[10px] text-[var(--color-brand)] font-bold uppercase tracking-wide">
              {t.today}
            </span>
          )}
        </div>

        <button
          onClick={() => setDayIndex(i => Math.min(weekDates.length - 1, i + 1))}
          disabled={dayIndex === weekDates.length - 1}
          aria-label={t.days[Math.min(weekDates.length - 1, dayIndex + 1)]}
          className="p-2 rounded-lg disabled:opacity-30 text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] text-xl leading-none"
        >
          ›
        </button>
      </div>

      {/* Dot indicator */}
      <div className="flex items-center justify-center gap-1.5">
        {weekDates.map((_, i) => (
          <button
            key={i}
            onClick={() => setDayIndex(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === dayIndex
                ? 'w-5 bg-[var(--color-accent)]'
                : 'w-1.5 bg-[var(--color-border)]'
            }`}
          />
        ))}
      </div>

      {/* Slot cards */}
      <div className="space-y-3">
        {daySlots.length === 0 && (
          <p className="text-center text-sm text-[var(--color-text-muted)] py-8">
            {t.noSlotsThisWeek}
          </p>
        )}
        {daySlots.map(slot => {
          const isFull = slot.attendeeCount >= slot.capacity;
          const isLoading = loadingSlotId === slot.id;
          const isToday = currentDate === today;

          return (
            <Card
              key={slot.id}
              className={`p-4 flex items-center justify-between ${
                isToday ? 'border-l-4 border-l-[var(--color-brand)]' : ''
              }`}
            >
              <div>
                <p className="font-semibold text-[var(--color-text)]">{slot.label}</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                  {slot.attendeeCount}/{slot.capacity}
                </p>
                <div className="mt-1.5">
                  {slot.isReservedByCurrentUser ? (
                    <Badge variant="accent">{t.slotReserved}</Badge>
                  ) : isFull ? (
                    <Badge variant="muted">{t.slotFull}</Badge>
                  ) : (
                    <Badge variant="muted">{t.slotAvailable}</Badge>
                  )}
                </div>
              </div>

              {slot.isReservedByCurrentUser ? (
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onToggle(slot)}
                >
                  {isLoading ? '...' : t.cancelSlot}
                </Button>
              ) : !isFull ? (
                <Button
                  variant="primary"
                  size="sm"
                  disabled={isLoading}
                  onClick={() => onToggle(slot)}
                >
                  {isLoading ? '...' : t.reserveSlot}
                </Button>
              ) : null}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
