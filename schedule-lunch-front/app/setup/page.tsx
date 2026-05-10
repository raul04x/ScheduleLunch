'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

export default function SetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: '', lastName: '', username: '', email: '', password: '', confirm: '',
  });

  useEffect(() => {
    api.setup.status().then(({ setupRequired }) => {
      if (!setupRequired) router.replace('/login');
      else setChecking(false);
    }).catch(() => setChecking(false));
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }
    setLoading(true);
    try {
      await api.setup.init({
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username,
        email: form.email,
        password: form.password,
      });
      router.replace('/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al crear el administrador.');
    } finally {
      setLoading(false);
    }
  };

  if (checking) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950">
      <div className="w-full max-w-md bg-gray-900 rounded-xl p-8 border border-gray-800">
        <h1 className="text-2xl font-bold text-white mb-2">Configuración inicial</h1>
        <p className="text-gray-400 text-sm mb-6">Crea la cuenta de administrador para empezar.</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <input name="firstName" placeholder="Nombre" value={form.firstName}
              onChange={handleChange} required
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
            <input name="lastName" placeholder="Apellido" value={form.lastName}
              onChange={handleChange} required
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
          </div>
          <input name="username" placeholder="Usuario" value={form.username}
            onChange={handleChange} required autoComplete="username"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
          <input name="email" type="email" placeholder="Correo electrónico" value={form.email}
            onChange={handleChange} required
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
          <input name="password" type="password" placeholder="Contraseña" value={form.password}
            onChange={handleChange} required autoComplete="new-password"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
          <input name="confirm" type="password" placeholder="Confirmar contraseña" value={form.confirm}
            onChange={handleChange} required autoComplete="new-password"
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-indigo-500 text-sm" />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">
            {loading ? 'Creando...' : 'Crear administrador'}
          </button>
        </form>
      </div>
    </div>
  );
}
