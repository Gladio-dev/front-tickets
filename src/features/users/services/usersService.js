// src/features/users/services/usersService.js
import { api } from '@/lib/api';

export const usersService = {
  // GET /api/users (Trae la lista de todos los usuarios registrados)
  async getAllUsers() {
    return api.get('/users');
  },

  // POST /api/auth/register (Crea un nuevo usuario en la base de datos)
  async registerUser(userData) {
    return api.post('/auth/register', userData);
  },

  // PUT /api/users/{id}/makeadmin (Eleva el rol de un usuario a ADMIN)
  async promoteToAdmin(userId) {
    return api.put(`/users/${userId}/makeadmin`);
  },

  // PUT /api/users/{id}/quitadmin (Degrada el rol de un usuario a USER)
  async demoteToUser(userId) {
    return api.put(`/users/${userId}/quitadmin`);
  }
};