import { create } from 'zustand';
import { bookingApi } from '../api/bookingApi';
import toast from 'react-hot-toast';

const useCartStore = create((set, get) => ({
  booking: null,
  items: [],
  itemCount: 0,
  isLoading: false,

  fetchCart: async (customerId) => {
    if (!customerId) return;
    set({ isLoading: true });
    try {
      const res = await bookingApi.getCart(customerId);
      const booking = res.data;
      const items = booking.items || [];
      set({ booking, items, itemCount: items.length, isLoading: false });
    } catch (err) {
      // 404 means no cart yet — that's normal
      if (err.response?.status === 404) {
        set({ booking: null, items: [], itemCount: 0, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    }
  },

  addItem: async (bookingRequest) => {
    try {
      await bookingApi.addItemToCart(bookingRequest);
      toast.success('Đã thêm vào giỏ hàng!');
      // Re-fetch cart to get latest state
      await get().fetchCart(bookingRequest.customerId);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data || 'Không thể thêm vào giỏ';
      toast.error(typeof msg === 'string' ? msg : 'Lỗi thêm vào giỏ hàng');
      throw err;
    }
  },

  removeItem: async (itemId, customerId) => {
    try {
      await bookingApi.removeItemFromCart(itemId);
      toast.success('Đã xóa khỏi giỏ hàng');
      await get().fetchCart(customerId);
    } catch (err) {
      toast.error('Không thể xóa');
      throw err;
    }
  },

  applyVoucher: async (bookingId, voucherCode, customerId) => {
    try {
      await bookingApi.applyVoucher(bookingId, voucherCode);
      toast.success('Áp dụng mã giảm giá thành công!');
      await get().fetchCart(customerId);
    } catch (err) {
      const msg = err.response?.data?.message || 'Mã giảm giá không hợp lệ';
      toast.error(typeof msg === 'string' ? msg : 'Lỗi áp dụng voucher');
      throw err;
    }
  },

  processPayment: async (bookingId, method) => {
  try {
    await bookingApi.processPayment(bookingId, method);
    
    // SAU KHI THANH TOÁN THÀNH CÔNG:
    // Reset toàn bộ state về trạng thái ban đầu
    set({ 
      booking: null, 
      items: [], 
      totalItems: 0 
    }); 
    
    return true;
  } catch (error) {
    console.error("Lỗi thanh toán:", error);
    throw error;
  }
},

  cancelBooking: async (bookingId, customerId) => {
    try {
      await bookingApi.cancelBooking(bookingId);
      toast.success('Đã hủy đơn hàng');
      await get().fetchCart(customerId);
    } catch (err) {
      toast.error('Không thể hủy đơn hàng');
      throw err;
    }
  },

  clearCart: () => {
    set({ booking: null, items: [], itemCount: 0 });
  },
}));

export default useCartStore;
