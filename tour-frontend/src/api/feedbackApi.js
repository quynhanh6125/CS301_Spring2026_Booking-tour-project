import api from './axios';

export const feedbackApi = {
  submitFeedback: (itemId, rating, comment) =>
    api.post('/feedbacks/submit', comment, {
      params: { itemId, rating },
      headers: { 'Content-Type': 'text/plain' },
    }),

  getAverageRating: (serviceId) =>
    api.get(`/feedbacks/average/${serviceId}`),

  getServiceFeedbacks: (serviceId) =>
    api.get(`/feedbacks/service/${serviceId}`),

  getProviderFeedbacks: (providerId) => api.get(`/feedbacks/provider/${providerId}`),
};
