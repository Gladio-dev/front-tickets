// src/features/dashboard/components/admin/AdminTicketsView.js
'use client';

import { useState, useEffect } from 'react';
import { ticketsService } from '@/features/tickets/services/ticketsService';
import { formatDate } from '@/utils/formatters';
import { TicketDetailModal } from '@/features/tickets/components/TicketDetailModal';



export function AdminTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    async function loadTickets() {
      try {
        setLoading(true);
        const data = await ticketsService.getAllTickets();
        // Spring Boot puede devolver un array directo o envuelto. Manejamos ambos casos de forma segura:
        setTickets(Array.isArray(data) ? data : data.content || []);
      } catch (err) {
        setError(err.message || 'Error al cargar el listado de tickets');
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  // Función para dar un diseño de Badge colorido al Status del ticket
  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-xs font-bold rounded-md tracking-wide uppercase ";
    switch (status) {
      case 'ABIERTO':
        return base + "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case 'EN_PROGRESO':
        return base + "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case 'CERRADO':
        return base + "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      default:
        return base + "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-slate-800 rounded-sm animate-pulse"></div>
        <div className="space-y-2">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-14 w-full bg-slate-850 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 border border-red-500/20 bg-red-500/5 text-red-400 rounded-xl">
        <p className="font-semibold">Error del Servidor</p>
        <p className="text-sm text-slate-400 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">Consola de Tickets Master</h2>
        <p className="text-slate-400 text-sm mt-1">
          Haga clic sobre cualquier fila para auditar los detalles del caso y abrir la bitácora de mensajes.
        </p>
      </div>

      {tickets.length === 0 ? (
        <div className="p-12 border border-slate-850 bg-slate-950/30 rounded-2xl text-center text-slate-500">
          No hay tickets registrados en el sistema de soporte actualmente.
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 bg-slate-950/40 rounded-xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Fecha de Creación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicket(ticket); // 👈 Guardamos todo el objeto del ticket
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-400 max-w-xs truncate">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-400">{ticket.area}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {formatDate(ticket.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Aquí inyectaremos el componente <TicketDetailModal /> en el siguiente paso */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket} // 👈 Pasamos el objeto ticket entero
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}