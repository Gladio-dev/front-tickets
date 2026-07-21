'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { authService } from '../services/authService';

export default function SetPasswordForm() {
  const params = useParams();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!password.trim()) {
      setError('La contraseña es obligatoria');
      return;
    }

    try {
      setLoading(true);
      await authService.activate(params?.variable, password);
      setSuccess('Contraseña establecida correctamente');
      setPassword('');
    } catch (err) {
      setError(err.message || 'No se pudo establecer la contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="flex flex-col gap-2 mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Establecer contraseña
        </h1>
        <p className="text-sm text-slate-500">
          Ingresa una contraseña nueva para activar tu cuenta.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg font-medium">
            {success}
          </div>
        )}

        <Input
          label="Nueva contraseña"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Ingresa tu contraseña"
          disabled={loading}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
}
