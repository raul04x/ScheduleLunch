'use client';

import { useTranslation } from '@/lib/i18n';
import { Button } from './Button';

interface Props {
  open: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  const { t } = useTranslation();
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onCancel}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className="relative bg-[var(--color-surface)] rounded-2xl p-6 w-full max-w-sm mx-4 shadow-[var(--shadow-elevated)]"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-base font-semibold text-[var(--color-text)] mb-2">
          {title ?? t.confirmDeleteTitle}
        </h3>
        <p className="text-sm text-[var(--color-text-muted)] mb-6">
          {message ?? t.confirmDeleteMessage}
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={onCancel}>{t.cancel}</Button>
          <Button variant="danger" onClick={onConfirm}>{confirmLabel ?? t.deleteAction}</Button>
        </div>
      </div>
    </div>
  );
}
