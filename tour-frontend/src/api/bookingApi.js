import api from './axios';

export const bookingApi = {
  getAvailableSlots: (serviceId, date) =>
    api.get('/bookings/slots', { params: { serviceId, date } }),

  addItemToCart: (bookingRequest) =>
    api.post('/bookings/add-item', bookingRequest),

  removeItemFromCart: (itemId) =>
    api.delete(`/bookings/items/${itemId}`),

  getCart: (customerId) =>
    api.get(`/bookings/cart/${customerId}`),

  applyVoucher: (bookingId, voucherCode) =>
    api.post(`/bookings/${bookingId}/voucher`, null, { params: { voucherCode } }),

  processPayment: (bookingId, method) =>
    api.post(`/bookings/${bookingId}/pay`, null, { params: { method } }),

  cancelBooking: (bookingId) =>
    api.post(`/bookings/${bookingId}/cancel`),

  confirmItem: (itemId, providerId) =>
    api.post(`/bookings/items/${itemId}/confirm`, null, { params: { providerId } }),

  rejectItem: (itemId, providerId) =>
    api.post(`/bookings/items/${itemId}/reject`, null, { params: { providerId } }),

  getProviderItems: (providerId) =>
    api.get(`/bookings/provider/${providerId}/items`),

  getHistory: (customerId) => api.get(`/bookings/customer/${customerId}`),
};
