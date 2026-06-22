"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificamos si el usuario ya tiene una sesión activa al cargar la página
  useEffect(() => {
    const token = localStorage.getItem("userRole");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
      {/* HEADER / BARRA SUPERIOR */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            T
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Ticket<span className="text-indigo-600">Flow</span>
          </span>
        </div>

        <div className="space-x-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-xs inline-block"
            >
              Ir al Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2 inline-block"
              >
                Iniciar Sesión
              </Link>
              <Link
                href="/register"
                className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg transition-all shadow-xs inline-block"
              >
                Registrarse
              </Link>
            </>
          )}
        </div>
      </header>

      {/* SECCIÓN HERO (PRINCIPAL) */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 max-w-4xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-full border border-indigo-100 mb-6">
          Soporte Técnico Simplificado
        </span>
        
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-tight">
          Gestiona tus incidentes <br />
          <span className="text-indigo-600">sin complicaciones.</span>
        </h1>

        <p className="mt-6 text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
          La plataforma centralizada para reportar fallas tecnológicas, dar seguimiento en tiempo real y resolver solicitudes de soporte de manera ágil y eficiente.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-base"
            >
              Volver a mi Panel de Control
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg text-base"
              >
                Registrarse ahora
              </Link>
              <Link
                href="/login"
                className="bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold px-8 py-3.5 rounded-xl transition-all shadow-xs text-base"
              >
                Iniciar Sesión
              </Link>
            </>
          )}
        </div>

        {/* SECCIÓN DE CARACTERÍSTICAS RÁPIDAS */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left w-full border-t border-slate-200 pt-12">
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-lg">Reportes en un clic</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Crea tickets detallando el problema técnico de inmediato desde cualquier dispositivo en tu red.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-lg">Roles Inteligentes</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Vistas optimizadas automáticamente. Los usuarios reportan, los administradores resuelven.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 text-lg">Seguridad Real JWT</h4>
            <p className="text-sm text-slate-500 leading-relaxed">Sesiones ultra seguras de larga duración mediante cookies HttpOnly firmadas digitalmente.</p>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 px-6 py-4 text-center text-xs text-slate-400 font-medium">
        &copy; {new Date().getFullYear()} TicketFlow. Todos los derechos reservados.
      </footer>
    </div>
  );
}