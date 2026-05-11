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

export default function LoginPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.auth.login(username, password);
      document.cookie = `sl_token=${res.token}; path=/; SameSite=Strict`;
      localStorage.setItem('sl_token', res.token);

      const me = await api.auth.me(res.token);
      if (me.membershipStatus !== 'Approved' && me.role === 'User') {
        router.push('/pending');
      } else {
        router.push(me.role === 'SuperAdmin' || me.role === 'GroupAdmin' ? '/admin/users' : '/schedule');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : t.loginError);
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
        <p className="mt-2 text-sm" style={{ color: '#F0A825' }}>Reserve your table</p>
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

            <h2 className="text-2xl font-bold text-[var(--color-text)]">{t.loginTitle}</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? t.signingIn : t.signIn}
              </Button>
            </form>

            <p className="text-center text-sm text-[var(--color-text-muted)]">
              {t.noAccount}{' '}
              <Link href="/register" className="text-[var(--color-accent)] hover:underline">
                {t.registerLink}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
