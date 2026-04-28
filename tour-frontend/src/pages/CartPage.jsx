import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Trash2, ChevronRight, Tag, CreditCard, CalendarDays, Clock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import PriceTag from '../components/ui/PriceTag';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';

const CartPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { booking, items, isLoading, fetchCart, removeItem, applyVoucher } = useCartStore();
  const [voucherCode, setVoucherCode] = useState('');
  const [applyingVoucher, setApplyingVoucher] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCart(user.id);
    }
  }, [isLoggedIn, user]);

  const handleRemoveItem = async (itemId) => {
    await removeItem(itemId, user.id);
  };

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim() || !booking) return;
    setApplyingVoucher(true);
    try {
      await applyVoucher(booking.id, voucherCode, user.id);
      setVoucherCode('');
    } catch {
      // handled
    }
    setApplyingVoucher(false);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-custom-bg flex items-center justify-center">
        <EmptyState
          icon={ShoppingCart}
          title="Vui lòng đăng nhập"
          description="Đăng nhập để xem giỏ hàng của bạn"
        />
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-primary font-medium">Giỏ hàng</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-text-primary mb-8 flex items-center gap-3">
          <ShoppingCart className="text-primary" size={28} />
          Giỏ hàng của bạn
          {items.length > 0 && (
            <span className="text-base font-normal text-text-secondary">({items.length} dịch vụ)</span>
          )}
        </h1>

        {items.length === 0 ? (
          <EmptyState
            icon={ShoppingCart}
            title="Giỏ hàng trống"
            description="Hãy khám phá các dịch vụ và thêm vào giỏ hàng!"
            action={() => navigate('/')}
            actionLabel="Khám phá ngay"
          />
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Items list */}
            <div className="flex-1 space-y-4">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Service image */}
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.service?.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300&q=80'}
                        alt={item.capturedName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-text-primary mb-2">{item.capturedName}</h3>
                      <div className="flex flex-wrap gap-3 text-xs text-text-secondary mb-3">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={13} /> {item.bookedDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={13} /> {item.startTimeSnap}
                        </span>
                        <span className="bg-gray-100 px-2 py-0.5 rounded-md">
                          x{item.quantity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <PriceTag price={item.capturedPrice * item.quantity} size="md" />
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-danger transition-colors p-2 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order summary */}
            <div className="lg:w-96">
              <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
                <h3 className="text-lg font-bold text-text-primary mb-5">Tóm tắt đơn hàng</h3>

                {/* Voucher */}
                <div className="mb-5">
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    <Tag size={14} className="inline mr-1" /> Mã giảm giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                      placeholder="Nhập mã voucher"
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
                    />
                    <button
                      onClick={handleApplyVoucher}
                      disabled={applyingVoucher || !voucherCode.trim()}
                      className="px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
                    >
                      {applyingVoucher ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {booking?.voucherCode && (
                    <p className="text-success text-xs mt-2 font-medium">
                      ✓ Đã áp dụng: {booking.voucherCode}
                    </p>
                  )}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 border-t border-gray-100 pt-5">
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Tạm tính</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking?.totalPrice || 0)}
                    </span>
                  </div>
                  {booking?.voucherCode && (
                    <div className="flex justify-between text-sm">
                      <span className="text-success">Giảm giá</span>
                      <span className="text-success font-medium">
                        -{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format((booking?.totalPrice || 0) - (booking?.finalAmount || 0))}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between items-center border-t border-gray-100 pt-3">
                    <span className="font-bold text-lg text-text-primary">Tổng cộng</span>
                    <PriceTag price={booking?.finalAmount || booking?.totalPrice || 0} size="lg" />
                  </div>
                </div>

                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full gradient-primary text-white py-4 rounded-xl font-bold mt-6 hover:opacity-90 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <CreditCard size={20} />
                  Tiến hành thanh toán
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;
