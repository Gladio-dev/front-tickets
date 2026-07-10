// src/features/dashboard/components/AdminDashboard.js
'use client';

import { useState } from 'react';
import { useAuth } from '@/features/auth';
import Button from '@/components/Button';
import { AdminTicketsView } from './admin/AdminTicketsView';
import { AdminUsersView } from './admin/AdminUsersView';
import { AdminReportsView } from './admin/AdminReportsView';

export function AdminDashboard() {
  const { user, logout } = useAuth();
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('tickets');

  // Orquestador interno de contenido para el Admin
  const renderContent = () => {
    switch (activeTab) {
      case 'tickets':
        return <AdminTicketsView />;
      case 'users':
        return <AdminUsersView />;
      case 'reports':
        return <AdminReportsView />;
      default:
        return <AdminTicketsView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Navbar Superior de Administración */}
      <nav className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-black tracking-wider text-blue-400">
            TICKET_FLOW // <span className="text-red-400 font-bold">ADMIN</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-medium text-slate-400">
            Modo Dios: <strong className="text-slate-200">{user?.username}</strong>
          </span>
          <Button variant="danger" onClick={logout}>
            Salir
          </Button>
        </div>
      </nav>

      {/* Cuerpo Principal con Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar de Navegación */}
        <aside className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-1.5 hidden md:block">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150
              ${activeTab === 'tickets' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            ✦ Consola de Tickets
          </button>
          
          <button
            onClick={() => setActiveTab('users')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150
              ${activeTab === 'users' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            📁 Gestionar Usuarios
          </button>

          <button
            onClick={() => setActiveTab('reports')}
            className={`w-full text-left px-4 py-3 rounded-lg text-sm font-semibold transition-colors duration-150
              ${activeTab === 'reports' 
                ? 'bg-blue-600 text-white shadow-xs' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'}`}
          >
            📊 Reportes Globales
          </button>
        </aside>

        {/* Contenido Dinámico según la pestaña activa */}
        <main className="flex-1 p-6 lg:p-8 animate-fade-in bg-slate-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}