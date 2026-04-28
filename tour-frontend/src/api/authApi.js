import api from './axios';

export const authApi = {
  registerCustomer: (userData) => api.post('/auth/register/customer', userData),
  registerProvider: (userData) => api.post('/auth/register/provider', userData),
  login: (username, password) => api.post('/auth/login', { username, password }),
};
