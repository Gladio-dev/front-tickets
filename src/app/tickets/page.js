'use client';

import { useAuth } from '@/features/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { RoleShell } from '@/features/dashboard/components/RoleShell';
import { AdminTicketsView } from '@/features/dashboard/components/admin/AdminTicketsView';

export default function TicketsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return null;
  }

  if (!user) return null;

  if (user.role === 'ADMIN') {
    return (
      <RoleShell requireRole={user.role}>
        <AdminTicketsView />
      </RoleShell>
    );
  }

  return (
    <RoleShell requireRole="USER">
      <div className="space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis tickets</h1>
          <p className="text-slate-500">Aquí verás tus solicitudes y su estado.</p>
        </header>
        
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-lg font-semibold text-slate-700">No tienes tickets aún</p>
          <p className="text-sm text-slate-400 mt-2">Pronto podrás ver y crear tus solicitudes desde aquí.</p>
        </div>
      </div>
    </RoleShell>
  );
}
