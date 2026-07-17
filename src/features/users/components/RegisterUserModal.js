// src/features/users/components/RegisterUserModal.js
'use client';

import { useState } from 'react';
import { usersService } from '../services/usersService';
import Button from '@/components/Button';

export function RegisterUserModal({ onClose, onUserCreated }) {
  const [formData, setFormData] = useState({ email: '', name: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.name || !formData.company) return;

    try {
      setLoading(true);
      setError(null);
      const newUser = await usersService.registerUser(formData);
      onUserCreated(newUser); // Notifica a la tabla para refrescar la lista
      onClose(); // Cierra el modal
    } catch (err) {
      setError(err.message || 'Error al registrar al usuario. Revisa los datos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
        <header className="flex justify-between items-center">
          <h3 className="text-lg font-bold text-white">Registrar Nuevo Colaborador</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-sm">✕</button>
        </header>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Nombre Completo</label>
            <input
              type="text"
              required
              placeholder="Ej: Mauricio López"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Correo Electrónico</label>
            <input
              type="email"
              required
              placeholder="mauricio@mail.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 placeholder-slate-600 focus:outline-hidden focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Compañía / Empresa
            </label>
            <select
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-slate-200 focus:outline-hidden focus:border-blue-500 appearance-none"
            >
              <option value="" disabled className="text-slate-600">
                Selecciona una empresa...
              </option>
              <option value="GLADIO" className="bg-slate-950 text-slate-200">Gladio</option>
              <option value="RS SEGURIDAD" className="bg-slate-950 text-slate-200">Rseguridad</option>
              <option value="BLUCOBALTO" className="bg-slate-950 text-slate-200">Blucobalto</option>
              <option value="NPLUS" className="bg-slate-950 text-slate-200">Nplus</option>
              <option value="ROSSOMORO" className="bg-slate-950 text-slate-200">Rossomoro</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Registrando...' : 'Dar de Alta'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}