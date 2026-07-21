// src/features/auth/services/authService.js
import { api } from '@/lib/api';

export const authService = {
  async login(email, password) {
    return api.post('/auth/login', { email, password });
  },

  async getCurrentSession() {
    return api.get('/auth/session');
  },

  async logout() {
    return api.post('/auth/logout');
  },

  async changePassword(email, oldPassword, newPassword) {
    return api.post('/auth/change_password', { email, oldPassword, newPassword });
  },

  async activate(uuid, password) {
    return api.put('/auth/activate', { password, uuid });
  },

  // Cambiado a resetPassword y pasando el email en el body
  async resetPassword(email) {
    return api.post('/auth/reset_password', { email });
  }
};