import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, CreditCard, Wallet, Building2, Shield, CalendarDays, Clock } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import PriceTag from '../components/ui/PriceTag';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';

const PAYMENT_METHODS = [
  { key: 'VNPAY', label: 'VNPay', icon: CreditCard, description: 'Thanh toán qua VNPay', color: 'text-blue-600' },
  { key: 'MOMO', label: 'MoMo', icon: Wallet, description: 'Ví điện tử MoMo', color: 'text-pink-500' },
  { key: 'BANK_TRANSFER', label: 'Chuyển khoản', icon: Building2, description: 'Chuyển khoản ngân hàng', color: 'text-emerald-600' },
];

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuthStore();
  const { booking, items, isLoading, fetchCart, processPayment } = useCartStore();
  const [selectedMethod, setSelectedMethod] = useState('VNPAY');
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      fetchCart(user.id);
    }
  }, [isLoggedIn, user]);

  const handlePayment = async () => {
    if (!booking) return;
    setIsProcessing(true);
    try {
      await processPayment(booking.id, selectedMethod);
      navigate('/booking-success');
    } catch {
      // handled in store
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isLoggedIn) return <EmptyState title="Vui lòng đăng nhập" />;
  if (isLoading) return <PageLoader />;
  if (!booking || items.length === 0) {
    return (
      <div className="min-h-screen bg-custom-bg flex items-center justify-center">
        <EmptyState
          title="Không có đơn hàng"
          description="Giỏ hàng trống, hãy thêm dịch vụ trước."
          action={() => navigate('/')}
          actionLabel="Khám phá ngay"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-custom-bg">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/cart" className="hover:text-primary">Giỏ hàng</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-primary font-medium">Thanh toán</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-text-primary mb-8">Thanh toán</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left — Payment method */}
          <div className="flex-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 mb-6"
            >
              <h2 className="font-bold text-text-primary mb-5 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                Phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <label
                      key={method.key}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        selectedMethod === method.key
                          ? 'border-primary bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.key}
                        checked={selectedMethod === method.key}
                        onChange={() => setSelectedMethod(method.key)}
                        className="sr-only"
                      />
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        selectedMethod === method.key ? 'bg-primary text-white' : 'bg-gray-100'
                      }`}>
                        <Icon size={20} className={selectedMethod === method.key ? '' : method.color} />
                      </div>
                      <div className="flex-1">
                        <span className="font-semibold text-text-primary text-sm">{method.label}</span>
                        <p className="text-text-muted text-xs">{method.description}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedMethod === method.key ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {selectedMethod === method.key && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                      </div>
                    </label>
                  );
                })}
              </div>
            </motion.div>

            <div className="flex items-center gap-2 text-xs text-text-secondary bg-green-50 p-4 rounded-xl">
              <Shield size={16} className="text-success flex-shrink-0" />
              <span>Thanh toán của bạn được bảo mật và mã hóa an toàn</span>
            </div>
          </div>

          {/* Right — Order summary */}
          <div className="lg:w-80">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24"
            >
              <h3 className="font-bold text-text-primary mb-4">Đơn hàng ({items.length} dịch vụ)</h3>
              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 min-w-0 mr-3">
                      <p className="font-medium text-text-primary truncate">{item.capturedName}</p>
                      <p className="text-xs text-text-muted flex items-center gap-2 mt-0.5">
                        <CalendarDays size={11} /> {item.bookedDate}
                        <Clock size={11} /> {item.startTimeSnap}
                      </p>
                      <p className="text-xs text-text-muted">x{item.quantity}</p>
                    </div>
                    <span className="font-semibold text-text-primary whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(item.capturedPrice * item.quantity)} ₫
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN').format(booking.totalPrice)} ₫</span>
                </div>
                {booking.voucherCode && (
                  <div className="flex justify-between text-sm text-success">
                    <span>Voucher ({booking.voucherCode})</span>
                    <span>-{new Intl.NumberFormat('vi-VN').format(booking.totalPrice - booking.finalAmount)} ₫</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <PriceTag price={booking.finalAmount || booking.totalPrice} size="lg" />
                </div>
              </div>

              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full gradient-primary text-white py-4 rounded-xl font-bold mt-6 hover:opacity-90 transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CreditCard size={20} />
                    Xác nhận thanh toán
                  </>
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
