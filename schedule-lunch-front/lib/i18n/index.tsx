'use client';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Locale, Translations } from './types';
import { es } from './locales/es';
import { en } from './locales/en';

const locales: Record<Locale, Translations> = { es, en };

const STORAGE_KEY = 'sl_locale';
const DEFAULT_LOCALE: Locale = 'es';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
  t: es,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
    if (stored && stored in locales) setLocaleState(stored);
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: locales[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}

export type { Locale, Translations };
