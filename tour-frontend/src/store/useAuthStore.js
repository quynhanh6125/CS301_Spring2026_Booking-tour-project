import { create } from 'zustand';
import { authApi } from '../api/authApi';
import toast from 'react-hot-toast';

// Hydrate from localStorage on startup
const savedUser = JSON.parse(localStorage.getItem('ta_user') || 'null');

const useAuthStore = create((set, get) => ({
  user: savedUser,
  isLoggedIn: !!savedUser,

  get isProvider() {
    return get().user?.role === 'PROVIDER';
  },
  get isCustomer() {
    return get().user?.role === 'CUSTOMER';
  },

  login: async (username, password) => {
    try {
      const res = await authApi.login(username, password);
      const user = res.data;
      localStorage.setItem('ta_user', JSON.stringify(user));
      set({ user, isLoggedIn: true });
      toast.success(`Chào mừng, ${user.username}!`);
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Sai tên đăng nhập hoặc mật khẩu';
      toast.error(msg);
      throw err;
    }
  },

  registerCustomer: async (userData) => {
    try {
      const res = await authApi.registerCustomer(userData);
      const user = res.data;
      localStorage.setItem('ta_user', JSON.stringify(user));
      set({ user, isLoggedIn: true });
      toast.success('Đăng ký thành công!');
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
      toast.error(msg);
      throw err;
    }
  },

  registerProvider: async (userData) => {
    try {
      const res = await authApi.registerProvider(userData);
      const user = res.data;
      localStorage.setItem('ta_user', JSON.stringify(user));
      set({ user, isLoggedIn: true });
      toast.success('Đăng ký đối tác thành công!');
      return user;
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại';
      toast.error(msg);
      throw err;
    }
  },

  logout: () => {
    localStorage.removeItem('ta_user');
    set({ user: null, isLoggedIn: false });
    toast.success('Đã đăng xuất');
  },
}));

export default useAuthStore;
