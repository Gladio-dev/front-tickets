'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/features/auth';
import { ticketsService } from '@/features/tickets/services/ticketsService';
import { CreateTicketModal } from './CreateTicketModal';
import { UserTicketDetailModal } from './UserTicketDetailModal'; // ← NUEVO IMPORT

// Mapeo de status a versiones amigables
const STATUS_MAP = {
  'ABIERTO': 'Abierto',
  'EN_PROCESO': 'En Proceso',
  'RESUELTO': 'Resuelto'
};

const STATUS_COLORS = {
  'ABIERTO': 'bg-blue-100 text-blue-700',
  'EN_PROCESO': 'bg-yellow-100 text-yellow-700',
  'RESUELTO': 'bg-green-100 text-green-700'
};

export function UserTicketView() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // NUEVOS ESTADOS PARA EL MODAL DE DETALLE
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ticketsService.getUserTickets();
      const sortedTickets = data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      setTickets(sortedTickets);
    } catch (err) {
      setError('Error al cargar tus tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleTicketCreated = () => {
    fetchTickets();
  };

  // NUEVA FUNCIÓN PARA ABRIR EL MODAL DE DETALLE
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsDetailModalOpen(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && tickets.length === 0) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis tickets</h1>
            <p className="text-slate-500 mt-1">Gestiona tus solicitudes</p>
          </div>
          <div className="h-10 w-32 bg-slate-200 rounded-lg animate-pulse"></div>
        </header>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-3 animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-1/2 mb-2 animate-pulse"></div>
              <div className="h-3 bg-slate-200 rounded w-1/3 animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis tickets</h1>
            <p className="text-slate-500 mt-1">Gestiona tus solicitudes</p>
          </div>
        </header>
        <div className="rounded-lg bg-red-50 p-4 text-red-700 border border-red-200">
          <p>{error}</p>
          <button 
            onClick={fetchTickets}
            className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 underline"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis tickets</h1>
          <p className="text-slate-500 mt-1">Gestiona tus solicitudes</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo ticket
        </button>
      </header>

      {tickets.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto h-16 w-16 text-slate-300 mb-4">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-900">No tienes tickets aún</h3>
          <p className="text-sm text-slate-500 mt-1">Crea tu primer ticket haciendo clic en "Nuevo ticket"</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => handleTicketClick(ticket)} // ← MODIFICADO
              className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all hover:border-blue-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {ticket.title}
                </h3>
                <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                  {STATUS_MAP[ticket.status] || ticket.status}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                  <span>#{ticket.id}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{formatDate(ticket.createdAt)}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-blue-600 group-hover:text-blue-700 font-medium flex items-center gap-1">
                  Ver detalles
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modales */}
      <CreateTicketModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTicketCreated}
      />

      {/* NUEVO MODAL DE DETALLE */}
      <UserTicketDetailModal
        ticket={selectedTicket}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedTicket(null);
        }}
      />
    </div>
  );
}