'use client';

import { useTheme } from '@/lib/theme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
