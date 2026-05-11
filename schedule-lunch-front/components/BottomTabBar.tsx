'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Props {
  isAdmin?: boolean;
}

export function BottomTabBar({ isAdmin = false }: Props) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const [moreOpen, setMoreOpen] = useState(false);

  const tabs = [
    { href: '/schedule', label: t.scheduleNav, icon: '📅' },
    ...(isAdmin ? [
      { href: '/admin/users', label: t.navUsers, icon: '👥' },
      { href: '/admin/slots', label: t.navSlots, icon: '⏰' },
    ] : []),
    { href: '#more', label: t.navMore, icon: '⚙️' },
  ];

  const handleSignOut = () => {
    document.cookie = 'sl_token=; path=/; max-age=0';
    localStorage.removeItem('sl_token');
    router.push('/login');
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-40 h-16 flex items-center bg-[var(--color-bg-subtle)]/90 backdrop-blur-sm border-t border-[var(--color-border)] md:hidden">
        {tabs.map(tab => {
          const isActive = tab.href !== '#more' && pathname.startsWith(tab.href);
          return (
            <button
              key={tab.href}
              onClick={() => tab.href === '#more' ? setMoreOpen(true) : router.push(tab.href)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 py-2"
            >
              <span
                className={`text-lg rounded-lg px-2 py-0.5 transition-colors ${
                  isActive ? 'bg-[var(--color-accent-dim)]' : ''
                }`}
              >
                {tab.icon}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  isActive ? 'text-[var(--color-accent)]' : 'text-[var(--color-text-muted)]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

      {moreOpen && (
        <div className="fixed inset-0 z-50 md:hidden" onClick={() => setMoreOpen(false)}>
          <div className="absolute inset-0 bg-black/40" />
          <div
            className="absolute bottom-0 left-0 right-0 bg-[var(--color-surface)] rounded-t-2xl p-6 space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[var(--color-border)] rounded-full mx-auto mb-4" />

            {isAdmin && (
              <button
                onClick={() => { router.push('/admin/groups'); setMoreOpen(false); }}
                className="flex items-center gap-3 py-3 w-full text-[var(--color-text)]"
              >
                <span>🏢</span>
                <span className="font-medium">{t.navGroups}</span>
              </button>
            )}

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--color-text-muted)]">Idioma</span>
              <LanguageSwitcher />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-[var(--color-text-muted)]">Tema</span>
              <ThemeToggle />
            </div>

            <button
              onClick={handleSignOut}
              className="w-full mt-2 py-3 text-red-500 font-medium border border-red-200 dark:border-red-900/40 rounded-xl"
            >
              {t.signOut}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
