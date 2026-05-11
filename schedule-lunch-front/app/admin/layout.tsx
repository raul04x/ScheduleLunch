'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  const links = [
    { href: '/admin/users', label: t.navUsers },
    { href: '/admin/groups', label: t.navGroups },
    { href: '/admin/slots', label: t.navSlots },
    { href: '/schedule', label: t.viewSchedule },
  ];

  function logout() {
    clearToken();
    document.cookie = 'sl_token=; Max-Age=0; path=/';
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-52 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2">
        <div className="text-red-400 font-bold mb-4">{t.adminTitle}</div>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`px-3 py-2 rounded text-sm ${pathname === l.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
            {l.label}
          </Link>
        ))}
        <div className="mt-auto flex flex-col gap-3">
          <LanguageSwitcher />
          <button onClick={logout} className="text-gray-500 text-sm hover:text-white text-left px-3">{t.signOut}</button>
        </div>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
