'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { clearToken } from '@/lib/auth';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

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
          <button onClick={logout} className="text-gray-400 hover:text-white">Salir</button>
        </div>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
