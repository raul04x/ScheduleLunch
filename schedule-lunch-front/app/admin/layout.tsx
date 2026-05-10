'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

const links = [
  { href: '/admin/users', label: 'Usuarios' },
  { href: '/admin/groups', label: 'Grupos' },
  { href: '/admin/slots', label: 'Slots' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    document.cookie = 'sl_token=; Max-Age=0; path=/';
    router.push('/login');
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      <aside className="w-52 bg-gray-900 border-r border-gray-800 p-4 flex flex-col gap-2">
        <div className="text-red-400 font-bold mb-4">Admin</div>
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className={`px-3 py-2 rounded text-sm ${pathname === l.href ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white'}`}>
            {l.label}
          </Link>
        ))}
        <button onClick={logout} className="mt-auto text-gray-500 text-sm hover:text-white text-left px-3">Salir</button>
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
