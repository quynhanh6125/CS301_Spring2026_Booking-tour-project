import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ClipboardList } from 'lucide-react';

const BookingSuccess = () => {
  return (
    <div className="min-h-screen bg-custom-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 20, stiffness: 200 }}
        className="bg-white rounded-3xl p-10 text-center max-w-md w-full shadow-lg border border-gray-100"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', damping: 15 }}
          className="w-24 h-24 gradient-primary rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="text-white" size={48} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-3xl font-black text-text-primary mb-3">Thanh toán thành công!</h1>
          <p className="text-text-secondary mb-8 leading-relaxed">
            Đơn hàng của bạn đã được xử lý thành công. Vui lòng chờ nhà cung cấp xác nhận dịch vụ.
          </p>

          <div className="bg-green-50 rounded-xl p-4 mb-8">
            <p className="text-success text-sm font-medium">
              ✓ Bạn sẽ nhận được thông báo khi đơn hàng được xác nhận
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              to="/"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl border border-gray-200 text-text-primary font-semibold hover:bg-gray-50 transition-colors"
            >
              <Home size={18} />
              Về trang chủ
            </Link>
            <Link
              to="/my-bookings"
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 rounded-xl gradient-primary text-white font-bold hover:opacity-90 transition-all shadow-md"
            >
              <ClipboardList size={18} />
              Xem đơn hàng
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default BookingSuccess;
