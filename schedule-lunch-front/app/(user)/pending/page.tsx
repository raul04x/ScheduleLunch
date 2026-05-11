'use client';

export default function PendingPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-2xl font-bold text-white mb-2">Solicitud enviada</h1>
      <p className="text-gray-400">Un administrador revisará tu solicitud y te dará acceso pronto.</p>
    </div>
  );
}
