import { ReactNode } from 'react';

type Variant = 'gold' | 'accent' | 'danger' | 'muted';

interface Props {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const variantClass: Record<Variant, string> = {
  gold:   'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  accent: 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]',
  danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  muted:  'bg-[var(--color-bg-subtle)] text-[var(--color-text-muted)]',
};

export function Badge({ variant = 'muted', children, className = '' }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantClass[variant]} ${className}`}>
      {children}
    </span>
  );
}
