'use client';

import { useState, useEffect } from 'react';
import { ticketsService } from '@/features/tickets/services/ticketsService';

// Opciones de áreas (backend: ODOO, SUPPORT)
const AREAS = {
  'ODOO': 'Odoo',
  'SUPPORT': 'Soporte'
};

// Tipos según área
const TYPES_BY_AREA = {
  'ODOO': [
    'Alta y/o Actualización de producto',
    'Licencia Odoo',
    'Fallas en Orden de Venta',
    'Creación de etiqueta Contactos/CRM',
    'Creación de campo',
    'Actualización de precios',
    'Alta de Cta Analítica',
    'Capacitación',
    'Otro'
  ],
  'SUPPORT': [
    'Falla con Celular o Linea Telefónica',
    'Falla de Equipo de Computo',
    'Falla en Impresora',
    'Office',
    'Falla en correo',
    'Instalación de Programas',
    'Control de Acceso',
    'Seguridad Patrimonial',
    'Capacitación',
    'Otro'
  ]
};

export function CreateTicketModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    area: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableTypes, setAvailableTypes] = useState([]);

  // Actualizar tipos disponibles cuando cambia el área
  useEffect(() => {
    if (formData.area) {
      setAvailableTypes(TYPES_BY_AREA[formData.area] || []);
      setFormData(prev => ({ ...prev, type: '' })); // Resetear tipo
    } else {
      setAvailableTypes([]);
    }
  }, [formData.area]);

  // Resetear formulario al abrir/cerrar
  useEffect(() => {
    if (!isOpen) {
      setFormData({ title: '', description: '', area: '', type: '' });
      setError(null);
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validaciones
    if (!formData.title.trim()) {
      setError('El título es obligatorio');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es obligatoria');
      return;
    }
    if (!formData.area) {
      setError('Debes seleccionar un área');
      return;
    }
    if (!formData.type) {
      setError('Debes seleccionar un tipo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await ticketsService.createTicket({
        title: formData.title.trim(),
        description: formData.description.trim(),
        area: formData.area, // Enviamos ODOO o SUPPORT
        type: formData.type
      });
      
      onSuccess(); // Recargar lista
      onClose(); // Cerrar modal
    } catch (err) {
      setError(err.message || 'Error al crear el ticket');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error al cambiar
    if (error) setError(null);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Slide-in panel desde la derecha */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Nuevo ticket</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              disabled={loading}
            >
              <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="flex-1 p-6 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-red-700 text-sm border border-red-200">
                {error}
              </div>
            )}

            {/* Título */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                Título
              </label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleChange}
                placeholder="Breve descripción del problema"
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                disabled={loading}
                autoFocus
              />
            </div>

            {/* Descripción */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe el problema en detalle"
                rows={4}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                disabled={loading}
              />
            </div>

            {/* Área */}
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-slate-700 mb-2">
                Área
              </label>
              <select
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                disabled={loading}
              >
                <option value="">Selecciona un área</option>
                {Object.entries(AREAS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo (dinámico según área) */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-slate-700 mb-2">
                Tipo
              </label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                disabled={!formData.area || loading}
              >
                <option value="">
                  {formData.area ? 'Selecciona un tipo' : 'Primero selecciona un área'}
                </option>
                {availableTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {formData.area && (
                <p className="mt-1 text-xs text-slate-500">
                  {availableTypes.length} opciones disponibles
                </p>
              )}
            </div>

            {/* Botones */}
            <div className="pt-4 border-t border-slate-200 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creando...
                  </>
                ) : (
                  'Crear ticket'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}