'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

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
    <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
      <div className="flex justify-end mb-4">
        <LanguageSwitcher />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">{t.loginTitle}</h1>
      <p className="text-gray-400 text-sm mb-6">{t.loginSubtitle}</p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input value={username} onChange={e => setUsername(e.target.value)}
          placeholder={t.usernamePlaceholder} required
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500" />
        <input value={password} onChange={e => setPassword(e.target.value)}
          placeholder={t.passwordPlaceholder} type="password" required
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500" />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button type="submit" disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium disabled:opacity-50">
          {loading ? t.signingIn : t.signIn}
        </button>
      </form>
      <p className="text-gray-500 text-sm mt-4 text-center">
        {t.noAccount}{' '}
        <Link href="/register" className="text-indigo-400 hover:underline">{t.registerLink}</Link>
      </p>
    </div>
  );
}
