// src/features/dashboard/components/admin/AdminTicketsView.js
'use client';

import { useState, useEffect } from 'react';
import { ticketsService } from '@/features/tickets/services/ticketsService';
import { formatDate } from '@/utils/formatters';
import { TicketDetailModal } from '@/features/tickets/components/AdminTicketDetailModal';

export function AdminTicketsView() {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [admins, setAdmins] = useState([]);

  // Estados de filtros
  const [filters, setFilters] = useState({
    status: 'TODOS',
    area: 'TODOS',
    assignedTo: 'TODOS'
  });

  // Cargar tickets y admins
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        
        // Cargar tickets
        const data = await ticketsService.getAllTickets();
        const ticketsData = Array.isArray(data) ? data : data.content || [];
        console.log(ticketsData);
        setTickets(ticketsData);
        
        // Cargar admins para el filtro
        try {
          const adminsData = await ticketsService.getAdmins();
          setAdmins(Array.isArray(adminsData) ? adminsData : []);
        } catch (err) {
          console.error('Error cargando admins:', err);
          setAdmins([]);
        }
        
      } catch (err) {
        setError(err.message || 'Error al cargar el listado de tickets');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Aplicar filtros cuando cambian los tickets o los filtros
  useEffect(() => {
    applyFilters();
  }, [tickets, filters]);

  const applyFilters = () => {
    let result = [...tickets];

    // Filtro por status
    if (filters.status !== 'TODOS') {
      result = result.filter(ticket => ticket.status === filters.status);
    }

    // Filtro por área
    if (filters.area !== 'TODOS') {
      result = result.filter(ticket => ticket.area === filters.area);
    }

    // Filtro por asignado a
    if (filters.assignedTo === 'SIN_ASIGNAR') {
      result = result.filter(ticket => !ticket.assignedTo);
    } else if (filters.assignedTo !== 'TODOS') {
      const adminId = parseInt(filters.assignedTo);
      result = result.filter(ticket => ticket.assignedTo?.id === adminId);
    } 

        // Filtro por compañia
    if (filters.company == 'GLADIO') {
      result = result.filter(ticket => ticket.user.company === 'GLADIO');
    } else if (filters.company == 'RSEGURIDAD') {
      result = result.filter(ticket => ticket.user.company === 'RSEGURIDAD');
    }else if (filters.company == 'BLUCOBALTO') {
      result = result.filter(ticket => ticket.user.company === 'BLUCOBALTO');
    }else if (filters.company == 'NPLUS') {
      result = result.filter(ticket => ticket.user.company === 'NPLUS');
    }else if (filters.company == 'ROSSOMORO') {
      result = result.filter(ticket => ticket.user.company === 'ROSSOMORO');
    } 

    setFilteredTickets(result);
  };

  // Función para resetear filtros
  const resetFilters = () => {
    setFilters({
      status: 'TODOS',
      area: 'TODOS',
      assignedTo: 'TODOS'
    });
  };

  // Función para dar un diseño de Badge colorido al Status del ticket
  const getStatusBadge = (status) => {
    const base = "px-2.5 py-1 text-xs font-bold rounded-md tracking-wide uppercase ";
    switch (status) {
      case 'ABIERTO':
        return base + "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
      case 'EN_PROGRESO':
        return base + "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case 'RESUELTO':
        return base + "bg-slate-500/10 text-slate-400 border border-slate-500/20";
      default:
        return base + "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    }
  };

  // Mapeo de status para mostrar amigable
  const STATUS_OPTIONS = {
    TODOS: 'Todos',
    ABIERTO: 'Abierto',
    EN_PROCESO: 'En Proceso',
    RESUELTO: 'Resuelto'
  };

  // Mapeo de áreas
  const AREA_OPTIONS = {
    TODOS: 'Todos',
    ODOO: 'Odoo',
    SUPPORT: 'Soporte'
  };
    const COMPANY_OPTIONS = {
    TODOS: 'Todos',
    GLADIO: 'Gladio',
    RSEGURIDAD: 'Rseguridad',
    BLUCOBALTO: 'Blucobalto',
    NPLUS: 'Nplus',
    ROSSOMORO: 'Rossomoro'
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

      {/* SECCIÓN DE FILTROS */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-300">Filtros</h3>
          <button
            onClick={resetFilters}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            Limpiar filtros
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Filtro por Status */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {Object.entries(STATUS_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Área */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Área
            </label>
            <select
              value={filters.area}
              onChange={(e) => setFilters({ ...filters, area: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {Object.entries(AREA_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro por Asignado a */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Asignado a
            </label>
            <select
              value={filters.assignedTo}
              onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            >
              <option value="TODOS">Todos</option>
              <option value="SIN_ASIGNAR">Sin asignar</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id.toString()}>
                  {admin.name || admin.email}
                </option>
              ))}
            </select>
          </div>
          {/* Filtro por Compañia */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Compañia
            </label>
            <select
              value={filters.company}
              onChange={(e) => setFilters({ ...filters, company: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500 transition-colors"
            >
              {Object.entries(COMPANY_OPTIONS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div className="text-xs text-slate-500 pt-2 border-t border-slate-800/50">
          Mostrando {filteredTickets.length} de {tickets.length} tickets
          {Object.values(filters).some(v => v !== 'TODOS') && (
            <span className="text-blue-400 ml-2">(filtros aplicados)</span>
          )}
        </div>
      </div>

      {/* TABLA DE TICKETS */}
      {filteredTickets.length === 0 ? (
        <div className="p-12 border border-slate-850 bg-slate-950/30 rounded-2xl text-center text-slate-500">
          {tickets.length === 0 ? (
            'No hay tickets registrados en el sistema de soporte actualmente.'
          ) : (
            'No hay tickets que coincidan con los filtros seleccionados.'
          )}
        </div>
      ) : (
        <div className="overflow-x-auto border border-slate-800 bg-slate-950/40 rounded-xl shadow-xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Título</th>
                <th className="px-6 py-4">Área</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Asignado a</th>
                <th className="px-6 py-4">Fecha de Creación</th>
                <th className="px-6 py-4">Fecha de Cierre</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {filteredTickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => {
                    setSelectedTicket(ticket);
                  }}
                  className="hover:bg-slate-800/40 cursor-pointer transition-colors duration-150 group"
                >
                  <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-400 max-w-xs truncate">
                    {ticket.id}
                  </td>
                  <td className="px-6 py-4 font-semibold text-white group-hover:text-blue-400 max-w-xs truncate">
                    {ticket.title}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-slate-400">
                      {ticket.area === 'ODOO' ? 'Odoo' : 
                       ticket.area === 'SUPPORT' ? 'Soporte' : 
                       ticket.area}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={getStatusBadge(ticket.status)}>
                      {ticket.status === 'EN_PROGRESO' ? 'EN PROCESO' : ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400">
                    {ticket.assignedTo ? (
                      <span className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-600/20 flex items-center justify-center text-blue-400 text-[10px] font-bold">
                          {ticket.assignedTo.name?.charAt(0).toUpperCase() || 'A'}
                        </span>
                        <span className="text-xs">{ticket.assignedTo.name || ticket.assignedTo.email}</span>
                      </span>
                    ) : (
                      <span className="text-xs text-slate-500 italic">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {formatDate(ticket.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">
                    {formatDate(ticket.assignedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal de detalle */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
        />
      )}
    </div>
  );
}