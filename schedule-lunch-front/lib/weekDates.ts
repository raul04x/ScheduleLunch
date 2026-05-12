export function getMondayOf(ref: Date): Date {
  const d = new Date(ref);
  d.setHours(0, 0, 0, 0);
  const dow = d.getDay();
  d.setDate(d.getDate() - (dow === 0 ? 6 : dow - 1));
  return d;
}

export function getWeekDatesFrom(monday: Date): string[] {
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d.toISOString().slice(0, 10);
  });
}

export function getWeekDates(): string[] {
  return getWeekDatesFrom(getMondayOf(new Date()));
}

export function getTodayDate(): string {
  return new Date().toISOString().slice(0, 10);
}

export function formatWeekRange(monday: Date, locale: string): string {
  const friday = new Date(monday);
  friday.setDate(monday.getDate() + 4);
  const fmt = (d: Date) => d.toLocaleDateString(locale === 'es' ? 'es-ES' : 'en-US', {
    day: 'numeric', month: 'short',
  });
  return `${fmt(monday)} – ${fmt(friday)}`;
}
