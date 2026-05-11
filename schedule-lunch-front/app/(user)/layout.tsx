'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken, getToken, decodeToken } from '@/lib/auth';
import { useTranslation } from '@/lib/i18n';
import { AppLogo } from '@/components/AppLogo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { MobileTopBar } from '@/components/MobileTopBar';
import { BottomTabBar } from '@/components/BottomTabBar';

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
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Desktop nav */}
      <nav className="hidden md:flex h-14 items-center justify-between px-6 bg-[var(--color-bg-subtle)] border-b border-[var(--color-border)]">
        <AppLogo size={24} />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAdmin && (
            <Link
              href="/admin/users"
              className="px-3 py-1.5 text-sm rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors"
            >
              {t.adminPanel}
            </Link>
          )}
          <button
            onClick={logout}
            className="px-3 py-1.5 text-sm rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-accent-dim)] hover:text-[var(--color-accent)] transition-colors"
          >
            {t.signOut}
          </button>
        </div>
      </nav>

      {/* Mobile top bar */}
      <MobileTopBar />

      {/* Content */}
      <main className="p-6 pt-20 pb-20 md:py-6">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <BottomTabBar isAdmin={isAdmin} />
    </div>
  );
}
