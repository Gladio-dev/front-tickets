// src/app/dashboard/page.js
'use client';

import { useAuth } from '@/features/auth';
import { AdminDashboard, UserDashboard, DashboardSkeleton } from '@/features/dashboard';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center space-y-4">
          <p className="text-red-600 font-medium">No estás autenticado para ver esta sección.</p>
          <a href="/login" className="text-blue-600 hover:underline font-medium text-sm">Ir al Login</a>
        </div>
      </div>
    );
  }

  // Renderizado condicional y modularizado basado en Roles
  return user.role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />;
}