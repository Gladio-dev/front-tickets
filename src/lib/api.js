// Detectamos dinámicamente la IP o dominio desde donde el usuario abrió la página
// Si estás en tu PC local, será 'localhost'. Si entran desde la red, será la IP de tu PC.
const getApiUrl = () => {
  if (typeof window !== "undefined") {
    const currentHostname = window.location.hostname; // Captura "localhost" o "192.168.X.X"
    return `http://${currentHostname}:8080/api`;
  }
  // Respaldo por si se ejecuta en el servidor (SSR) de Next.js
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
};

export const apiFetch = async (endpoint, options = {}) => {
  const BASE_URL = getApiUrl(); // Obtenemos la IP dinámica aquí

  const defaultOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include", 
  };

  // Reemplazamos la vieja variable por BASE_URL
  const response = await fetch(`${BASE_URL}${endpoint}`, defaultOptions);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Ocurrió un error");
  }

  if (response.status === 204) return null;
  return response.json();
};