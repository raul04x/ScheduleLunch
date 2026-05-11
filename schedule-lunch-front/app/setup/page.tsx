'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { AppLogo } from '@/components/AppLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function SetupPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', confirm: '',
    groupName: '', groupDescription: '',
  });

  useEffect(() => {
    api.setup.status().then(({ setupRequired }) => {
      if (!setupRequired) router.replace('/login');
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      await api.setup.init({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
        groupName: form.groupName,
        groupDescription: form.groupDescription || undefined,
      });
      router.replace('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.setupError);
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex">
      {/* Left panel — always dark */}
      <div
        className="hidden md:flex md:w-2/5 flex-col items-center justify-center p-12"
        style={{ background: '#0A1628' }}
      >
        <AppLogo size={64} withWordmark={false} />
        <h1 className="mt-6 text-2xl font-bold text-white">ScheduleLunch</h1>
        <p className="mt-2 text-sm" style={{ color: '#F0A825' }}>Reserve your table</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-[var(--color-bg)]">
        <div className="flex justify-end p-4 gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-6">
          <div className="w-full max-w-sm space-y-6">
            <div className="md:hidden flex flex-col items-center mb-2">
              <AppLogo size={40} withWordmark={false} />
              <h1 className="mt-3 text-xl font-bold text-[var(--color-text)]">ScheduleLunch</h1>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{t.setupTitle}</h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.setupSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                {t.administratorSection}
              </p>
              <div className="flex gap-3">
                <Input
                  name="firstName"
                  placeholder={t.firstNamePlaceholder}
                  value={form.firstName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="lastName"
                  placeholder={t.lastNamePlaceholder}
                  value={form.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <Input
                name="username"
                placeholder={t.usernameSectionPlaceholder}
                value={form.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
              <Input
                name="email"
                type="email"
                placeholder={t.emailPlaceholder}
                value={form.email}
                onChange={handleChange}
                required
              />
              <Input
                name="password"
                type="password"
                placeholder={t.passwordSetupPlaceholder}
                value={form.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />
              <Input
                name="confirm"
                type="password"
                placeholder={t.confirmPasswordPlaceholder}
                value={form.confirm}
                onChange={handleChange}
                required
                autoComplete="new-password"
              />

              <div className="border-t border-[var(--color-border)] pt-4 mt-1 space-y-4">
                <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  {t.firstGroupSection}
                </p>
                <Input
                  name="groupName"
                  placeholder={t.groupNamePlaceholder}
                  value={form.groupName}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="groupDescription"
                  placeholder={t.groupDescPlaceholder}
                  value={form.groupDescription}
                  onChange={handleChange}
                />
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button variant="gold" type="submit" disabled={loading} className="w-full">
                {loading ? t.settingUp : t.completeSetup}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
