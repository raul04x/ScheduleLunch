'use client';

import { AppLogo } from '@/components/AppLogo';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  title?: string;
}

export function MobileTopBar({ title }: Props) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between px-4 bg-[var(--color-bg-subtle)]/90 backdrop-blur-sm border-b border-[var(--color-border)] md:hidden">
      <AppLogo size={22} withWordmark={false} />
      {title && (
        <span className="text-sm font-semibold text-[var(--color-text)]">{title}</span>
      )}
      <ThemeToggle />
    </header>
  );
}
