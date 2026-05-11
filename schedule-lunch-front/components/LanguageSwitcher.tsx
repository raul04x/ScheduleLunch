'use client';

import { useTranslation, type Locale } from '@/lib/i18n';

const locales: Locale[] = ['es', 'en'];

export function LanguageSwitcher() {
  const { locale, setLocale } = useTranslation();

  return (
    <div className="flex rounded-lg border border-[var(--color-border)] overflow-hidden text-xs">
      {locales.map(loc => (
        <button
          key={loc}
          onClick={() => setLocale(loc)}
          className={`px-2.5 py-1.5 font-medium transition-colors ${
            locale === loc
              ? 'bg-[var(--color-accent)] text-white'
              : 'text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)]'
          }`}
        >
          {loc.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
