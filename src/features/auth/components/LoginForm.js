// src/features/auth/components/LoginForm.js
'use client';

import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginForm() {
  const { login, error: authError, loading } = useAuth();
const [email, setEmail] = useState(''); // <-- Antes era username
const [password, setPassword] = useState('');
const [errors, setErrors] = useState({});

const validateForm = () => {
  const localErrors = {};
  if (!email.trim()) localErrors.email = 'El correo electrónico es obligatorio'; // <-- Validación de email
  if (!password) localErrors.password = 'La contraseña es obligatoria';
  setErrors(localErrors);
  return Object.keys(localErrors).length === 0;
};

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  try {
    await login(email, password); // <-- Mandamos email
  } catch (err) {}
};

  return (
    <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="flex flex-col gap-2 mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Bienvenido de nuevo
        </h1>
        <p className="text-sm text-slate-500">
          Ingresa tus credenciales para acceder al sistema de tickets
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {authError && (
          <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">
            {authError}
          </div>
        )}

        <Input
          label="Correo Electrónico" // <-- Texto actualizado
          id="email"
          type="email" // <-- Cambiado a tipo email para validación nativa del navegador
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          placeholder="admin@mail.com"
          disabled={loading}
        />

        <Input
          label="Contraseña"
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          placeholder="••••••••"
          disabled={loading}
        />

        <div className="pt-2">
          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Iniciando sesión...' : 'Ingresar'}
          </Button>
        </div>
      </form>
    </div>
  );
}