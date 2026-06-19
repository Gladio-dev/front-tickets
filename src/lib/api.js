const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const apiFetch = async (endpoint, options = {}) => {
  // Combinamos las opciones que nos pasen con las configuraciones obligatorias de seguridad
  const defaultOptions = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // CRUCIAL: Esto le dice a Next.js que envíe y reciba cookies HttpOnly con el backend
    credentials: "include", 
  };

  const response = await fetch(`${API_URL}${endpoint}`, defaultOptions);

  // Si el backend responde con un error, disparamos una excepción con el mensaje de Java
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Ocurrió un error en el servidor");
  }

  // Si la respuesta está vacía (como un 204), evitamos que falle al parsear JSON
  if (response.status === 204) return null;

  return response.json();
};