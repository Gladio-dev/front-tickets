// src/app/tickets/page.js
'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminTicketsView } from '@/features/dashboard/components/admin/AdminTicketsView';

export default function TicketsPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Cargando consola de soporte...</p>
      </div>
    );
  }

  if (!user) return null;

  // 🔀 Si el rol es ADMIN, le prestamos la misma interfaz estructural de admin directamente aquí
  if (user.role === 'ADMIN') {
    return <AdminTicketsView />;
  }

  // 👤 Si el rol es USER, aquí pintaremos el cascarón del cliente en el siguiente paso
  return (
    <div className="p-8 text-white">
      <h1>Panel del Cliente (Próximamente)</h1>
      <p>Bienvenido, {user.name}. Aquí verás tus propios tickets asignados.</p>
    </div>
  );
}