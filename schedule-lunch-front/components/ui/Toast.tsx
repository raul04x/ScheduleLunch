'use client';

import { useEffect } from 'react';

interface Props {
  message: string;
  onDone: () => void;
}

export function Toast({ message, onDone }: Props) {
  useEffect(() => {
    const id = setTimeout(onDone, 3000);
    return () => clearTimeout(id);
  }, [message, onDone]);

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-[var(--shadow-elevated)] text-sm text-[var(--color-text)] whitespace-nowrap pointer-events-none">
      ✓ {message}
    </div>
  );
}
