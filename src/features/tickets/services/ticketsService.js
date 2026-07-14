// src/features/tickets/services/ticketsService.js
import { api } from '@/lib/api';

export const ticketsService = {
  // GET /api/tickets (Trae la lista maestra de todos los tickets)
  async getAllTickets() {
    return api.get('/tickets');
  },

  // GET /api/tickets/{id}/messages (Trae el historial de chat de un ticket específico)
  async getTicketMessages(ticketId) {
    return api.get(`/tickets/${ticketId}/messages`);
  },

  // POST /api/tickets/{ticketId}/messages (Envía un nuevo mensaje al chat)
  async sendTicketMessage(ticketId, content) {
    return api.post(`/tickets/${ticketId}/messages`, { content });
  },
    async getUserTickets() {
    try {
      return api.get('/tickets');
      
    } catch (error) {
      console.error('Error fetching user tickets:', error);
      throw error;
    }
  },

  // Crear nuevo ticket
  async createTicket(ticketData) {
    try {
      console.log(ticketData);
      const response = await api.post('/tickets', ticketData);
      return response.data;
    } catch (error) {
      console.error('Error creating ticket:', error);
      throw error;
    }
  },

  // Obtener detalle de un ticket específico (para después)
  async getTicketDetail(ticketId) {
    try {
      const response = await api.get(`/tickets/${ticketId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching ticket detail:', error);
      throw error;
    }
  },

    async sendTicketMessage(ticketId, content) {
    try {
      const data = await api.post(`/tickets/${ticketId}/messages`, { content });
      return data;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  },
  // Obtener lista de administradores
async getAdmins() {
  try {
    const data = await api.get('/auth/admins');
    return data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
},

// Asignar un administrador a un ticket
async assignTicket(ticketId, adminId) {
  try {
    const data = await api.put(`/tickets/${ticketId}/assigned`, { id: adminId });
    return data;
  } catch (error) {
    console.error('Error assigning admin:', error);
    throw error;
  }
},

// Cambiar estado a EN_PROGRESO
async startTicketProcess(ticketId) {
  try {
    const data = await api.put(`/tickets/${ticketId}/inprocess`);
    return data;
  } catch (error) {
    console.error('Error starting ticket process:', error);
    throw error;
  }
},

// Cambiar estado a RESUELTO
async solveTicket(ticketId) {
  try {
    const data = await api.put(`/tickets/${ticketId}/solve`);
    return data;
  } catch (error) {
    console.error('Error solving ticket:', error);
    throw error;
  }
},

  
};