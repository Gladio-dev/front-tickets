'use client'; // Obligatorio para usar Hooks y Contextos en Next.js App Router

import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Guardará { username, role }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Validar sesión al cargar la aplicación
  useEffect(() => {
    async function checkSession() {
      try {
        const sessionData = await authService.getCurrentSession();
        setUser(sessionData);
      } catch (err) {
        // Si falla (ej: 401 sin cookie), el usuario no está autenticado
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email, password) => {
    setError(null);
    setLoading(true);
    try {
      await authService.login(email, password);
      // Tras un login exitoso, pedimos la sesión para actualizar el estado global
      const sessionData = await authService.getCurrentSession();
      setUser(sessionData);
      router.push('/dashboard'); // Redirección automática al entrar
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Error al cerrar sesión en el servidor', err);
    } finally {
      setUser(null);
      router.push('/login');
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN', // Ajusta según los roles de tu Spring Boot
  };

  // NOTA EN REACT 19: Usamos <AuthContext> directamente en lugar de <AuthContext.Provider>
  return (
    <AuthContext value={value}>
      {children}
    </AuthContext>
  );
}

// Hook personalizado para consumir el contexto fácilmente
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}