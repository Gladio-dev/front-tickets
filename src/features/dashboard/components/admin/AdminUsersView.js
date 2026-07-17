// src/features/dashboard/components/admin/AdminUsersView.js
'use client';
import { useState, useEffect } from 'react';
import { usersService } from '@/features/users/services/usersService';
import { RegisterUserModal } from '@/features/users/components/RegisterUserModal';
import Button from '@/components/Button';

export function AdminUsersView() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null); // Bloquea solo la fila del usuario mutado
  const [passwordLoadingId, setPasswordLoadingId] = useState(null);

  // 1. Cargar el listado al montar el componente
  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const data = await usersService.getAllUsers();
        setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Error al conectar con la base de datos de usuarios');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  // 2. Switchear el estado de Admin / User usando tus endpoints REST específicos
  const handleToggleAdmin = async (userItem) => {
    try {
      setActionLoadingId(userItem.id);
      const isAdmin = userItem.role === 'ADMIN';

      if (isAdmin) {
        // Quitar admin
        await usersService.demoteToUser(userItem.id);
        setUsers((prev) =>
          prev.map((u) => u.id === userItem.id ? { ...u, role: 'USER' } : u)
        );
      } else {
        // Hacer admin
        await usersService.promoteToAdmin(userItem.id);
        setUsers((prev) =>
          prev.map((u) => u.id === userItem.id ? { ...u, role: 'ADMIN' } : u)
        );
      }
    } catch (err) {
      alert("No se pudo actualizar el rol del usuario.");
    } finally {
      setActionLoadingId(null);
    }
  };
//Reiniciar contraseñas
  const handleToggleForcePassword = async (userItem) => {
  // No es necesario verificar porque el botón ya está deshabilitado,
  // pero lo dejamos por seguridad
  if (userItem.needNewPassword === true) return;
  
  try {
    setPasswordLoadingId(userItem.id);
    
    // Cambiar de false a true
    await usersService.toggleForcePassword(userItem.id, true);
    
    // Actualizar el estado local
    setUsers((prev) => 
      prev.map((u) => 
        u.id === userItem.id 
          ? { ...u, needNewPassword: true } 
          : u
      )
    );
  } catch (err) {
    alert("No se pudo actualizar la configuración de contraseña.");
  } finally {
    setPasswordLoadingId(null);
  }
};

  // 3. Callback al registrar con éxito un usuario
  const handleUserCreated = (newUser) => {
    // Si Spring Boot te devuelve el objeto recién creado, lo inyectamos al estado.
    // Si tu endpoint devuelve vacío, puedes re-ejecutar el GET aquí.
    if (newUser && newUser.id) {
      setUsers((prev) => [...prev, newUser]);
    } else {
      usersService.getAllUsers().then(data => setUsers(Array.isArray(data) ? data : []));
    }
  };

  if (loading) {
    return <div className="text-sm text-slate-400 animate-pulse">Sincronizando base de datos de usuarios...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight text-white">Gestión de Usuarios</h2>
          <p className="text-slate-400 text-sm mt-1">Administra los roles globales y autorizaciones de acceso al sistema.</p>
        </div>
        <div>
          <Button variant="primary" onClick={() => setShowRegisterModal(true)}>
            Dar de Alta Usuario
          </Button>
        </div>
      </header>

      <div className="overflow-x-auto border border-slate-800 bg-slate-950/40 rounded-xl shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950 text-xs font-bold uppercase tracking-wider text-slate-400">
              <th className="px-6 py-4">Nombre</th>
              <th className="px-6 py-4">Correo Electrónico</th>
              <th className="px-6 py-4">Compañía</th>
              <th className="px-6 py-4">Rol de Sistema</th>
              <th className="px-6 py-4">Forzar cambio de contraseña</th>
              <th className="px-6 py-4">Acciones de Acceso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
            {users.map((item) => (
              <tr key={item.id} className="hover:bg-slate-800/20 transition-colors duration-150">
                <td className="px-6 py-4 font-semibold text-white">{item.name}</td>
                <td className="px-6 py-4 font-mono text-xs text-slate-400">{item.email}</td>
                <td className="px-6 py-4 text-slate-400">{item.company}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-sm tracking-wide border uppercase
                    ${item.role === 'ADMIN'
                      ? 'bg-red-500/10 text-red-400 border-red-500/20'
                      : 'bg-slate-700/20 text-slate-400 border-slate-700/30'}`}
                  >
                    {item.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
  <button
    disabled={passwordLoadingId !== null || item.needNewPassword == true}
    onClick={() => handleToggleForcePassword(item)}
    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border
      ${item.needNewPassword === true
        ? 'border-gray-500/20 text-gray-500 bg-gray-500/5 cursor-not-allowed opacity-50'
        : 'border-green-500/30 text-green-400 bg-green-500/5 hover:bg-green-500/10 cursor-pointer'}`}
  >
    {passwordLoadingId === item.id 
      ? '...' 
      : item.needNewPassword === true 
        ? '🔒 Reseteo pendiente' 
        : '🔓 Resetear'}
  </button>
</td>

                <td className="px-6 py-4 text-right">
                  <button
                    disabled={actionLoadingId !== null}
                    onClick={() => handleToggleAdmin(item)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border cursor-pointer
                      ${item.role === 'ADMIN'
                        ? 'border-red-500/30 text-red-400 bg-red-500/5 hover:bg-red-500/10'
                        : 'border-blue-500/30 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10'}`}
                  >
                    {actionLoadingId === item.id
                      ? '...'
                      : item.role === 'ADMIN' ? '✕ Quitar Admin' : '✦ Hacer Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Renderizado condicional del modal de creación */}
      {showRegisterModal && (
        <RegisterUserModal
          onClose={() => setShowRegisterModal(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </div>
  );
}