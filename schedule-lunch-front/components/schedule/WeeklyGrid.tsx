'use client';
import type { TimeSlotDto } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { SlotCell } from './SlotCell';

interface Props {
  slots: TimeSlotDto[];
  onToggle: (slot: TimeSlotDto) => void;
  loadingSlotId: string | null;
}

function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().split('T')[0];
  });
}

export function WeeklyGrid({ slots, onToggle, loadingSlotId }: Props) {
  const { t } = useTranslation();
  const weekDates = getWeekDates();
  const allLabels = [...new Set(slots.map(s => s.label))].sort();
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="w-24 text-left text-xs text-gray-500 pb-2">{t.scheduleHeader}</th>
            {weekDates.map((date, i) => (
              <th key={date} className="text-center text-xs text-gray-400 pb-2 px-1">
                <div className={`rounded px-2 py-1 ${date === today ? 'bg-indigo-900 text-indigo-300' : ''}`}>
                  {t.days[i]}<br />{date.slice(8)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {allLabels.map(label => (
            <tr key={label}>
              <td className="text-xs text-gray-500 py-1 pr-2">{label}</td>
              {weekDates.map(date => {
                const slot = slots.find(s => s.date.startsWith(date) && s.label === label);
                return (
                  <td key={date} className="px-1 py-1">
                    {slot
                      ? <SlotCell slot={slot} onToggle={onToggle} loading={loadingSlotId === slot.id} />
                      : <div className="h-12 rounded bg-gray-900 opacity-30" />}
                  </td>
                );
              })}
            </tr>
          ))}
          {allLabels.length === 0 && (
            <tr><td colSpan={6} className="text-center text-gray-600 py-8">{t.noSlotsThisWeek}</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
