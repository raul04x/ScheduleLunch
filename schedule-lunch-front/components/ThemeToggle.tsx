'use client';

import { useTheme } from '@/lib/theme';
import { useTranslation } from '@/lib/i18n';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? t.switchToLight : t.switchToDark}
      className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
