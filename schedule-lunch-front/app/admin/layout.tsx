'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { AppLogo } from '@/components/AppLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MobileTopBar } from '@/components/MobileTopBar';
import { BottomTabBar } from '@/components/BottomTabBar';

const navItems = [
  { href: '/admin/users',  labelKey: 'navUsers'     as const, icon: '👥' },
  { href: '/admin/slots',  labelKey: 'navSlots'     as const, icon: '⏰' },
  { href: '/admin/groups', labelKey: 'navGroups'    as const, icon: '🏢' },
  { href: '/schedule',     labelKey: 'viewSchedule' as const, icon: '📅' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t } = useTranslation();

  function logout() {
    clearToken();
    document.cookie = 'sl_token=; Max-Age=0; path=/';
    router.push('/login');
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-bg)]">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 flex-col bg-[var(--color-surface)] border-r border-[var(--color-border)]">
        <div className="p-5 border-b border-[var(--color-border)]">
          <AppLogo size={28} />
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-[var(--color-accent-dim)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)]'
                }`}
              >
                <span>{item.icon}</span>
                {t[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[var(--color-border)] space-y-2">
          <div className="flex items-center justify-between px-3 py-1">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <button
            onClick={logout}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[var(--color-text-muted)] hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
          >
            {t.signOut}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <MobileTopBar />

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 md:pt-0 pt-14 pb-16 md:pb-0 p-6">
          {children}
        </main>
      </div>

      {/* Mobile bottom tab bar */}
      <BottomTabBar isAdmin={true} />
    </div>
  );
}
