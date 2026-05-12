'use client';

import type { TimeSlotDto } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { SlotCell } from './SlotCell';
import { getWeekDatesFrom, getTodayDate, formatWeekRange } from '@/lib/weekDates';

interface Props {
  slots: TimeSlotDto[];
  onToggle: (slot: TimeSlotDto) => void;
  loadingSlotId: string | null;
  monday: Date;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export function WeeklyGrid({ slots, onToggle, loadingSlotId, monday, onPrevWeek, onNextWeek }: Props) {
  const { t, locale } = useTranslation();
  const weekDates = getWeekDatesFrom(monday);
  const today = getTodayDate();

  // One row per unique start time, sorted chronologically
  const timeRows = [...new Map(slots.map(s => [s.startTime, s])).values()]
    .sort((a, b) => (a.startTime ?? '').localeCompare(b.startTime ?? ''));

  const isCurrentWeek = weekDates[0] <= today && today <= weekDates[4];

  return (
    <div>
      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onPrevWeek}
          aria-label="Previous week"
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors text-lg leading-none"
        >
          ‹
        </button>

        <div className="text-center">
          <p className="text-sm font-semibold text-[var(--color-text)]">
            {formatWeekRange(monday, locale)}
          </p>
          {isCurrentWeek && (
            <span className="text-[10px] text-[var(--color-brand)] font-bold uppercase tracking-wide">
              {t.currentWeek}
            </span>
          )}
        </div>

        <button
          onClick={onNextWeek}
          aria-label="Next week"
          className="p-2 rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors text-lg leading-none"
        >
          ›
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Time column header */}
              <th className="w-20 text-left text-xs text-[var(--color-text-muted)] pb-2 pr-2" />
              {weekDates.map((date, i) => (
                <th key={date} className="text-center text-xs text-[var(--color-text-muted)] pb-2 px-1">
                  <div className={`rounded px-2 py-1 ${
                    date === today
                      ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)] font-semibold'
                      : ''
                  }`}>
                    {t.days[i]}
                    <br />
                    {date.slice(8)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {timeRows.map(row => (
              <tr key={row.label}>
                {/* Time label — show only start time */}
                <td className="text-xs text-[var(--color-text-muted)] py-1 pr-2 whitespace-nowrap">
                  {row.startTime ? row.startTime.slice(0, 5) : row.label}
                </td>
                {weekDates.map(date => {
                  const slot = slots.find(s => s.date === date && s.startTime === row.startTime);
                  return (
                    <td key={date} className="px-1 py-1">
                      {slot
                        ? <SlotCell slot={slot} onToggle={onToggle} loading={loadingSlotId === slot.id} />
                        : <div className="h-12 rounded bg-[var(--color-bg-subtle)] opacity-30" />}
                    </td>
                  );
                })}
              </tr>
            ))}

            {timeRows.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-[var(--color-text-muted)] text-sm py-12">
                  {t.noSlotsThisWeek}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
