// src/app/(admin)/layout.js
'use client';

import { useAuth } from '@/features/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Button from '@/components/Button';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname(); // Para saber en qué URL estamos y pintar el botón activo

  // Protección de ruta a nivel cliente
  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Pantalla de carga mientras valida la sesión de Spring Boot
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400 animate-pulse">Verificando credenciales de administrador...</p>
      </div>
    );
  }

  // Si no hay usuario o no es admin, no renderizamos nada mientras redirige el useEffect
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar Superior Fija */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-wider text-blue-400">
            TICKET_FLOW // <span className="text-red-400 font-bold">ADMIN</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400">
            Modo Dios: <strong className="text-slate-200">{user.username}</strong>
          </span>
          <Button
            variant="danger"
            onClick={async () => {
              await logout();
              router.push('/login'); // 👈 Expulsión proactiva e inmediata al Login
            }}
          >
            Salir
          </Button>
        </div>
      </nav>

      {/* Cuerpo Principal con Menú Lateral */}
      <div className="flex flex-1">
        {/* Sidebar con Enlaces Reales utilizando <Link> de Next.js */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1.5 hidden md:block">
          <Link
            href="/tickets"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150
              ${pathname === '/tickets'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            ✦ Consola de Tickets
          </Link>

          <Link
            href="/usuarios"
            className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150
              ${pathname === '/usuarios'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            📁 Gestionar Usuarios
          </Link>
        </aside>

        {/* Aquí Next.js inyectará dinámicamente /tickets o /usuarios */}
        <main className="flex-1 p-6 lg:p-8 animate-fade-in bg-slate-900">
          {children}
        </main>
      </div>
    </div>
  );
}