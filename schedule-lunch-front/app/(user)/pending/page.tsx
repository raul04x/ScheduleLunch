'use client';

import { useTranslation } from '@/lib/i18n';
import { AppLogo } from '@/components/AppLogo';

export default function PendingPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center gap-6">
      <div className="relative">
        <AppLogo size={64} withWordmark={false} />
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[55%] w-3 h-3 rounded-full bg-[var(--color-brand)] animate-pulse-gold" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text)] mb-2">{t.pendingTitle}</h1>
        <p className="text-[var(--color-text-muted)] max-w-xs">{t.pendingMessage}</p>
      </div>
    </div>
  );
}
