// src/lib/api.js

// const BASE_URL = 'https://tickets-servhub.up.railway.app/api'; // production
const BASE_URL = 'https://tickets-servhub-staging.up.railway.app/api'; // staging
// const BASE_URL = 'http://localhost:8080/api'; // Ajusta el puerto y ruta según tu Spring Boot

export const api = {
  async request(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;

    // Configuraciones por defecto obligatorias para JWT + Cookies
    const defaultOptions = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // CREDENTIALS 'include' es VITAL. 
      // Le dice al navegador que envíe las cookies HttpOnly en cada petición a Spring Boot.
      credentials: 'include', 
    };

    try {
      const response = await fetch(url, defaultOptions);
      console.log(`Request to ${url} body ${defaultOptions.body} `);
      console.log(response);

      // Si la respuesta no es exitosa (4xx o 5xx), lanzamos un error estructurado
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.log(errorData);
        throw {
          status: response.status,
          message: errorData.message || 'Ocurrió un error en la petición',
        };
      }

      // Si el backend no devuelve contenido (ej: 204 No Content), evitamos que falle al parsear JSON
      if (response.status === 204) return null;

      return await response.json();
    } catch (error) {
      // Si ya es un error estructurado por nosotros, lo relanzamos
      if (error.status) throw error;
      
      // Error de red (backend apagado, etc.)
      throw { status: 500, message: 'No se pudo conectar con el servidor backend' };
    }
  },

  get(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body, options) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint, options) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  },
};