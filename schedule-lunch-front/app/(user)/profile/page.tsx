'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import type { MeResponse } from '@/lib/types';

export default function ProfilePage() {
  const { t } = useTranslation();
  const token = getToken() ?? '';
  const [me, setMe] = useState<MeResponse | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.auth.me(token).then(data => {
      setMe(data);
      setFirstName(data.firstName ?? '');
      setLastName(data.lastName ?? '');
    });
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSaved(false);
    setLoading(true);
    try {
      await api.auth.updateProfile(firstName, lastName, token);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError(t.profileSaveError);
    } finally {
      setLoading(false);
    }
  }

  if (!me) return null;

  return (
    <div className="max-w-md">
      <h1 className="text-xl font-bold text-[var(--color-text)] mb-6">{t.profileTitle}</h1>

      <Card className="p-5 space-y-6">
        {/* Read-only account info */}
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide mb-3">
            {t.accountSection}
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-muted)]">{t.usernamePlaceholder}</span>
              <span className="text-sm font-medium text-[var(--color-text)]">{me.username}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
              <span className="text-sm text-[var(--color-text-muted)]">{t.emailPlaceholder}</span>
              <span className="text-sm font-medium text-[var(--color-text)]">{me.email}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--color-text-muted)]">{t.roleCol}</span>
              <span className="text-sm font-medium text-[var(--color-text)]">{me.role}</span>
            </div>
          </div>
        </div>

        {/* Editable name */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wide">
            {t.fullNameCol}
          </p>
          <div className="flex gap-3">
            <Input
              placeholder={t.firstNamePlaceholder}
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
            />
            <Input
              placeholder={t.lastNamePlaceholder}
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
          {saved && <p className="text-sm text-green-500">{t.profileSaved}</p>}

          <Button type="submit" variant="gold" disabled={loading} className="w-full">
            {loading ? t.savingProfile : t.saveChanges}
          </Button>
        </form>
      </Card>
    </div>
  );
}
