import api from './api';

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  updateLastLogin: (userId) => api.post('/auth/update-last-login', { userId })
}