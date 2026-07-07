"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();

  // Estados del usuario y los tickets
  const [user, setUser] = useState({ email: "", role: "" });
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Estado para el formulario de nuevo ticket (Solo para USER)
  const [newTicket, setNewTicket] = useState({ title: "", description: "" });

  useEffect(() => {
    // 1. Validamos si hay datos del usuario en el localStorage
    const storedRole = localStorage.getItem("userRole");
    const storedEmail = localStorage.getItem("userEmail" );

    if (!storedRole || !storedEmail) {
      // Si no hay datos, significa que no ha iniciado sesión y lo rebotamos al login
      router.push("/login");
      return;
    }

    setUser({ email: storedEmail, role: storedRole });
    fetchTickets();
  }, []);

  // 2. Función para listar los tickets desde el backend
  const fetchTickets = async () => {
    try {
      setError("");
      const data = await apiFetch("/tickets");
      setTickets(data);
    } catch (err) {
      setError(err.message || "Error al cargar los tickets");
    } finally {
      setLoading(false);
    }
  };

  // 3. Función para que el USER cree un ticket
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    try {
      await apiFetch("/tickets", {
        method: "POST",
        body: JSON.stringify(newTicket),
      });
      setNewTicket({ title: "", description: "" }); // Limpiar formulario
      fetchTickets(); // Refrescar la tabla automáticamente
    } catch (err) {
      setError(err.message || "No se pudo crear el ticket");
    }
  };

  // 4. Función para que el ADMIN actualice el estado
  const handleUpdateStatus = async (ticketId, nextStatus) => {
    try {
      await apiFetch(`/tickets/${ticketId}/status`, {
        method: "PUT",
        body: JSON.stringify({ status: nextStatus }),
      });
      fetchTickets(); // Refrescar la tabla para ver el cambio de color/estado
    } catch (err) {
      setError(err.message || "No se pudo cambiar el estado");
    }
  };

  // 5. Botón de salida
  const handleLogout = () => {
    localStorage.clear();
    // Como no hemos implementado borrar la cookie HttpOnly en Java, 
    // al menos limpiamos la vista y mandamos al login.
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600 font-medium">
        Cargando sistema...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* BARRA DE NAVEGACIÓN SUPERIOR */}
      <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-md border border-indigo-100 mr-3">
            {user.role}
          </span>
          <span className="text-sm font-medium text-slate-600">{user.email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm font-semibold text-red-600 hover:text-red-500 transition-colors bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg cursor-pointer"
        >
          Cerrar Sesión
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* PANEL IZQUIERDO: FORMULARIO SOLO SI ES USER */}
        {user.role === "USER" && (
          <div className="bg-white p-6 rounded-2xl shadow-xs border border-slate-200 h-fit">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Reportar Nuevo Incidente</h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                  placeholder="Ej. Problemas con el monitor"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Descripción</label>
                <textarea
                  required
                  rows="4"
                  value={newTicket.description}
                  onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                  placeholder="Describe los detalles del fallo aquí..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-lg text-sm transition-all shadow-xs cursor-pointer"
              >
                Enviar Ticket
              </button>
            </form>
          </div>
        )}

        {/* PANEL DERECHO / ANCHO: LISTADO DE TICKETS */}
        <div className={`bg-white p-6 rounded-2xl shadow-xs border border-slate-200 ${user.role === "USER" ? "md:col-span-2" : "md:col-span-3"}`}>
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {user.role === "ADMIN" ? "Panel de Gestión Global de Tickets" : "Mis Tickets Reportados"}
          </h3>

          {error && (
            <div className="p-4 mb-4 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 font-medium">
              ⚠️ {error}
            </div>
          )}

          {tickets.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">No hay tickets registrados en este momento.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs text-slate-400 font-semibold uppercase border-b border-slate-100">
                  <tr>
                    <th className="p-3">ID</th>
                    <th className="p-3">Título / Detalle</th>
                    <th className="p-3">Estado</th>
                    {user.role === "ADMIN" && <th className="p-3">Acciones Admin</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3 font-semibold text-slate-400">#{ticket.id}</td>
                      <td className="p-3">
                        <div className="font-bold text-slate-900">{ticket.title}</div>
                        <div className="text-xs text-slate-500">{ticket.description}</div>
                        {user.role === "ADMIN" && (
                          <div className="text-[11px] text-indigo-600 mt-1">Por: {ticket.user?.email}</div>
                        )}
                      </td>
                      <td className="p-3">
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-md ${
                          ticket.status === 'ABIERTO' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                          ticket.status === 'EN_PROCESO' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      {user.role === "ADMIN" && (
                        <td className="p-3 space-x-2">
                          {ticket.status !== "EN_PROCESO" && ticket.status !== "RESUELTO" && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, "EN_PROCESO")}
                              className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2 py-1 rounded font-semibold transition-all cursor-pointer"
                            >
                              Atender
                            </button>
                          )}
                          {ticket.status !== "RESUELTO" && (
                            <button
                              onClick={() => handleUpdateStatus(ticket.id, "RESUELTO")}
                              className="text-xs bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded font-semibold transition-all cursor-pointer"
                            >
                              Resolver
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}