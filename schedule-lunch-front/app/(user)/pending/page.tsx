'use client';
import { useTranslation } from '@/lib/i18n';

export default function PendingPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-2xl font-bold text-white mb-2">{t.pendingTitle}</h1>
      <p className="text-gray-400">{t.pendingMessage}</p>
    </div>
  );
}
