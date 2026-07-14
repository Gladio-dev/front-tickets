// // src/features/dashboard/components/UserDashboard.js
// 'use client';

// import { useAuth } from '@/features/auth';
// import Button from '@/components/Button';

// export function UserDashboard() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
//       {/* Navbar Superior de Cliente */}
//       <nav className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-xs">
//         <div className="flex items-center gap-2">
//           <span className="text-xl font-bold tracking-tight text-blue-600">TicketFlow</span>
//           <span className="bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
//             Cliente
//           </span>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-sm font-medium text-slate-600">
//             Usuario: <strong className="text-slate-900">{user?.username}</strong>
//           </span>
//           <Button variant="secondary" onClick={logout}>
//             Cerrar Sesión
//           </Button>
//         </div>
//       </nav>

//       {/* Layout de Usuario de una sola columna centralizada */}
//       <main className="flex-1 max-w-5xl w-full mx-auto p-6 lg:p-8 space-y-6">
//         <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold tracking-tight text-slate-900">Mis Solicitudes</h1>
//             <p className="text-slate-500 mt-1">Administra y sigue el estado de tus reportes de soporte técnico.</p>
//           </div>
//           <div>
//             <Button variant="primary">+ Crear Nuevo Ticket</Button>
//           </div>
//         </header>

//         {/* Zona donde inyectaremos las peticiones específicas del Usuario más adelante */}
//         <div className="p-12 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center bg-white shadow-xs">
//           <p className="text-lg font-semibold text-slate-700">Historial de Tickets Vacío</p>
//           <p className="text-sm text-slate-400 max-w-sm mt-1">
//             Aquí cargaremos la lista simplificada con los tickets que tú hayas reportado únicamente.
//           </p>
//         </div>
//       </main>
//     </div>
//   );
// }