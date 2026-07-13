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
  }
};