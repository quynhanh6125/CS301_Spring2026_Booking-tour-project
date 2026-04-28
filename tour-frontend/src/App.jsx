import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import useAuthStore from './store/useAuthStore';
import useCartStore from './store/useCartStore';

// Pages
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import ServiceDetail from './pages/ServiceDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingSuccess from './pages/BookingSuccess';
import MyBookings from './pages/MyBookings';
import NotFound from './pages/NotFound';

// Provider pages
import Dashboard from './pages/provider/Dashboard';
import MyServices from './pages/provider/MyServices';
import ManageSlots from './pages/provider/ManageSlots';
import Orders from './pages/provider/Orders';
import Reviews from './pages/provider/Reviews';

function App() {
  const { user, isLoggedIn } = useAuthStore();
  const { fetchCart } = useCartStore();

  // 1. CẬP NHẬT: Cho phép cả Provider load giỏ hàng khi login
  useEffect(() => {
    const canFetchCart = isLoggedIn && user && (user.role === 'CUSTOMER' || user.role === 'PROVIDER');
    if (canFetchCart) {
      fetchCart(user.id);
    }
  }, [isLoggedIn, user, fetchCart]);

  return (
    <Routes>
      <Route element={<Layout />}>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/booking-success" element={<BookingSuccess />} />

        {/* 2. CẬP NHẬT: Cho phép cả CUSTOMER và PROVIDER xem lịch sử đơn hàng */}
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute requiredRole={['CUSTOMER', 'PROVIDER']}>
              <MyBookings />
            </ProtectedRoute>
          }
        />

        {/* Provider routes (Giữ nguyên tính bảo mật chỉ dành cho PROVIDER) */}
        <Route
          path="/provider/dashboard"
          element={
            <ProtectedRoute requiredRole="PROVIDER">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/services"
          element={
            <ProtectedRoute requiredRole="PROVIDER">
              <MyServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/services/:serviceId/slots"
          element={
            <ProtectedRoute requiredRole="PROVIDER">
              <ManageSlots />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/orders"
          element={
            <ProtectedRoute requiredRole="PROVIDER">
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/provider/reviews"
          element={
            <ProtectedRoute requiredRole="PROVIDER">
              <Reviews />
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;