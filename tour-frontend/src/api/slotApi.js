import api from './axios';

export const slotApi = {
  createSlot: (serviceId, providerId, data) =>
    api.post(`/service-slots/create/${serviceId}`, data, { params: { providerId } }),

  updateSlot: (slotId, providerId, data) =>
    api.put(`/service-slots/${slotId}`, data, { params: { providerId } }),

  deleteSlot: (slotId, providerId) =>
    api.delete(`/service-slots/${slotId}`, { params: { providerId } }),

  restoreSlot: (slotId, providerId) =>
    api.patch(`/service-slots/${slotId}/restore`, null, { params: { providerId } }),

  getSlotsByService: (serviceId) =>
    api.get(`/service-slots/service/${serviceId}`),
};
