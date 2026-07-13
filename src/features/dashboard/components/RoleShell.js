'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/features/auth';
import Button from '@/components/Button';

export function RoleShell({ children, requireRole = 'ANY' }) {
  const { user, loading, logout, changePassword } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  useEffect(() => {
    if (!loading && requireRole === 'ADMIN' && user?.role !== 'ADMIN') {
      router.replace('/tickets');
    }
  }, [loading, requireRole, user?.role, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-400">Verificando acceso...</p>
      </div>
    );
  }

  if (!user) return null;

  const displayName = user.username || user.name || 'Usuario';

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await changePassword(oldPassword, newPassword);
      setMessage(response?.message || 'Contraseña cambiada correctamente');
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage(err?.message || 'No se pudo cambiar la contraseña');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user.role === 'ADMIN') {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
        <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
          <div className="flex items-center gap-3">
            <span className="text-xl font-black tracking-wider text-blue-400">
              TICKET_FLOW // <span className="text-red-400 font-bold">ADMIN</span>
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-slate-400">
              Modo Dios: <strong className="text-slate-200">{displayName}</strong>
            </span>
            <Button
              variant="danger"
              onClick={async () => {
                await logout();
                router.push('/login');
              }}
            >
              Salir
            </Button>
          </div>
        </nav>

        <div className="flex flex-1">
          <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1.5 hidden md:block">
            <Link
              href="/tickets"
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                pathname === '/tickets'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              ✦ Consola de Tickets
            </Link>

            <Link
              href="/usuarios"
              className={`block px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150 ${
                pathname === '/usuarios'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              📁 Gestionar Usuarios
            </Link>
          </aside>
          <main className="flex-1 p-6 lg:p-8 animate-fade-in bg-slate-900">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-blue-600">TicketFlow</span>
          <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
            Cliente
          </span>
        </div>
        <div className="flex items-center gap-4 relative">
          <span className="text-sm font-medium text-slate-600">
            Usuario: <strong className="text-slate-900">{displayName}</strong>
          </span>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200"
            >
              ☰
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 bg-white p-2 shadow-lg z-10">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setModalOpen(true);
                  }}
                  className="block w-full text-left rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                >
                  Cambiar contraseña
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    setMenuOpen(false);
                    await logout();
                    router.push('/login');
                  }}
                  className="mt-1 block w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {modalOpen && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">Cambiar contraseña</h2>
              <button
                type="button"
                onClick={() => {
                  setModalOpen(false);
                  setMessage('');
                  setOldPassword('');
                  setNewPassword('');
                }}
                className="text-sm text-slate-500 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Contraseña actual</label>
                <input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">Nueva contraseña</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
                  required
                />
              </div>

              {message && (
                <p className={`text-sm ${message.includes('correctamente') ? 'text-green-600' : 'text-red-600'}`}>
                  {message}
                </p>
              )}

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => {
                  setModalOpen(false);
                  setMessage('');
                  setOldPassword('');
                  setNewPassword('');
                }}>
                  Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Guardando...' : 'Guardar'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <main className="flex-1 max-w-6xl w-full mx-auto p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
}
