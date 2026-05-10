'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { getToken } from '@/lib/auth';
import type { TimeSlotDto } from '@/lib/types';

export default function AdminSlotsPage() {
  const [slots, setSlots] = useState<TimeSlotDto[]>([]);
  const [form, setForm] = useState({ date: '', label: '', startTime: '', endTime: '', capacity: 5 });
  const token = getToken() ?? '';

  useEffect(() => { api.schedule.getWeek(token).then(setSlots); }, [token]);

  function set(field: string) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm(f => ({ ...f, [field]: field === 'capacity' ? Number(e.target.value) : e.target.value }));
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const slot = await api.schedule.createSlot({
      date: form.date,
      label: form.label,
      startTime: form.startTime + ':00',
      endTime: form.endTime + ':00',
      capacity: form.capacity,
    }, token);
    setSlots(prev => [...prev, slot]);
    setForm({ date: '', label: '', startTime: '', endTime: '', capacity: 5 });
  }

  async function remove(id: string) {
    await api.schedule.deleteSlot(id, token);
    setSlots(prev => prev.filter(s => s.id !== id));
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-bold text-white mb-6">Gestion de Slots</h1>
      <form onSubmit={create} className="bg-gray-900 p-4 rounded-xl border border-gray-800 mb-8 grid grid-cols-2 gap-3">
        <h2 className="col-span-2 text-sm text-gray-400 font-medium">Nuevo slot</h2>
        <input type="date" value={form.date} onChange={set('date')} required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <input value={form.label} onChange={set('label')} placeholder="Etiqueta (ej: 12:00-12:20)" required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <input type="time" value={form.startTime} onChange={set('startTime')} required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <input type="time" value={form.endTime} onChange={set('endTime')} required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <input type="number" value={form.capacity} onChange={set('capacity')} min={1} max={50} required
          className="bg-gray-800 text-white px-3 py-2 rounded border border-gray-700 text-sm" />
        <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 rounded text-sm font-medium">
          Crear slot
        </button>
      </form>
      <ul className="flex flex-col gap-2">
        {slots.map(s => (
          <li key={s.id} className="flex items-center justify-between bg-gray-900 p-3 rounded-lg border border-gray-800">
            <div className="text-sm">
              <span className="text-white font-medium">{s.label}</span>
              <span className="text-gray-500 ml-2">{s.date}</span>
              <span className="text-gray-500 ml-2">cap. {s.capacity}</span>
              <span className="text-gray-500 ml-2">{s.attendeeCount} reservas</span>
            </div>
            <button onClick={() => remove(s.id)} className="text-red-500 hover:text-red-400 text-sm">Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
