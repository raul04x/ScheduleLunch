'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, getToken, decodeToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { t } = useTranslation();
  const token = getToken();
  const role = token ? decodeToken(token)?.role : null;
  const isAdmin = role === 'GroupAdmin' || role === 'SuperAdmin';

  function logout() {
    clearToken();
    document.cookie = 'sl_token=; Max-Age=0; path=/';
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <nav className="bg-gray-900 border-b border-gray-800 px-6 py-3 flex items-center justify-between">
        <Link href="/schedule" className="text-indigo-400 font-bold text-lg">ScheduleLunch</Link>
        <div className="flex gap-4 items-center text-sm">
          <LanguageSwitcher />
          {isAdmin && (
            <Link href="/admin/users" className="text-gray-400 hover:text-white">{t.adminPanel}</Link>
          )}
          <button onClick={logout} className="text-gray-400 hover:text-white">{t.signOut}</button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
