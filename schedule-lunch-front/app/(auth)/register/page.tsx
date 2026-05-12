'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { AppLogo } from '@/components/AppLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PasswordStrength } from '@/components/ui/PasswordStrength';

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError(t.passwordMismatch);
      return;
    }
    setLoading(true);
    try {
      const res = await api.auth.register(form.username, form.email, form.password);
      document.cookie = `sl_token=${res.token}; path=/; SameSite=Strict`;
      localStorage.setItem('sl_token', res.token);
      router.push('/pending');
    } catch {
      setError(t.registerError);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — always dark */}
      <div
        className="hidden md:flex md:w-2/5 flex-col items-center justify-center p-12"
        style={{ background: '#0A1628' }}
      >
        <AppLogo size={64} withWordmark={false} />
        <h1 className="mt-6 text-2xl font-bold text-white">ScheduleLunch</h1>
        <p className="mt-2 text-sm" style={{ color: '#F0A825' }}>{t.tagline}</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col bg-[var(--color-bg)]">
        <div className="flex justify-end p-4 gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>

        <div className="flex-1 flex items-center justify-center px-8">
          <div className="w-full max-w-sm space-y-6">
            <div className="md:hidden flex flex-col items-center mb-2">
              <AppLogo size={40} withWordmark={false} />
              <h1 className="mt-3 text-xl font-bold text-[var(--color-text)]">ScheduleLunch</h1>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[var(--color-text)]">{t.registerTitle}</h2>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">{t.registerSubtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder={t.usernamePlaceholder}
                value={form.username}
                onChange={set('username')}
                required
              />
              <Input
                type="email"
                placeholder={t.emailPlaceholder}
                value={form.email}
                onChange={set('email')}
                required
              />
              <Input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={form.password}
                onChange={set('password')}
                required
              />
              <PasswordStrength password={form.password} />
              <Input
                type="password"
                placeholder={t.passwordConfirmPlaceholder}
                value={form.confirm}
                onChange={set('confirm')}
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t.registering : t.register}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)]">
              {t.hasAccount}{' '}
              <Link href="/login" className="text-[var(--color-accent)] hover:underline">
                {t.loginLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
