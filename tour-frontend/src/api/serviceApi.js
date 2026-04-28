import api from './axios';

export const serviceApi = {
  getAllServices: () => api.get('/services/all'),
  searchServices: (query) => api.get('/services/search', { params: { q: query } }),
  getServiceById: (id) => api.get(`/services/${id}`),
  getSubServices: (id) => api.get(`/services/${id}/sub-services`),
  getProviderServices: (providerId) => api.get(`/services/provider/${providerId}`),
  getProviderDashboard: (providerId) => api.get(`/services/provider/${providerId}/dashboard`),
  createService: (data) => api.post('/services/create', data),
  updateService: (id, providerId, data) => api.put(`/services/${id}`, data, { params: { providerId } }),
  deleteService: (id, providerId) => api.delete(`/services/${id}`, { params: { providerId } }),
  restoreService: (id, providerId) => api.patch(`/services/${id}/restore`, null, { params: { providerId } }),
  addMemberToCombo: (parentId, serviceId, providerId) =>
    api.post(`/services/${parentId}/add-member/${serviceId}`, null, { params: { providerId } }),

};
