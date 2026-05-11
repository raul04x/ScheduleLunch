'use client';
import { useTranslation, type Locale } from '@/lib/i18n';

const options: { value: Locale; label: string }[] = [
  { value: 'es', label: 'ES' },
  { value: 'en', label: 'EN' },
];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex gap-1">
      {options.map(o => (
        <button
          key={o.value}
          onClick={() => setLocale(o.value)}
          className={`text-xs px-2 py-1 rounded transition-colors ${
            locale === o.value
              ? 'bg-indigo-600 text-white'
              : 'text-gray-500 hover:text-white'
          }`}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
