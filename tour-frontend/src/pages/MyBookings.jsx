import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ClipboardList, CalendarDays, Clock, 
  XCircle, Star, Send, Package, ShoppingCart, ArrowRight, AlertCircle 
} from 'lucide-react';
import useAuthStore from '../store/useAuthStore';
import { bookingApi } from '../api/bookingApi';
import { feedbackApi } from '../api/feedbackApi';
import PriceTag from '../components/ui/PriceTag';
import EmptyState from '../components/ui/EmptyState';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  PENDING_PROVIDER: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-700' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Bị từ chối', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600' },
};

const BOOKING_STATUS_MAP = {
  PENDING: { label: 'Chờ thanh toán', color: 'bg-amber-100 text-amber-700' },
  PAID: { label: 'Đang xử lý', color: 'bg-blue-100 text-blue-700' },
  SUCCESS: { label: 'Thành công', color: 'bg-green-100 text-green-700' },
  FAILED: { label: 'Thất bại', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600' },
};

const MyBookings = () => {
  const { user, isLoggedIn } = useAuthStore();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // States cho Modal
  const [feedbackModal, setFeedbackModal] = useState(null); 
  const [cancelModal, setCancelModal] = useState({ isOpen: false, bookingId: null }); // State mới cho Cancel Modal
  
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const res = await bookingApi.getHistory(user.id);
      setBookings(res.data);
    } catch (err) {
      toast.error("Không thể tải lịch sử đơn hàng");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn && user) { fetchHistory(); }
  }, [isLoggedIn, user]);

  // SỬA: Thay handleCancel cũ bằng trigger mở Modal
  const openCancelModal = (bookingId) => {
    setCancelModal({ isOpen: true, bookingId });
  };

  // SỬA: Hàm thực hiện hủy sau khi khách xác nhận trên Modal
  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      await bookingApi.cancelBooking(cancelModal.bookingId);
      toast.success("Đã hủy đơn hàng thành công");
      setCancelModal({ isOpen: false, bookingId: null });
      fetchHistory();
    } catch (err) {
      toast.error("Lỗi khi hủy đơn");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedbackModal) return;
    setSubmittingFeedback(true);
    try {
      await feedbackApi.submitFeedback(feedbackModal, feedbackRating, feedbackComment);
      toast.success('Cảm ơn bạn đã đánh giá!');
      setFeedbackModal(null);
      setFeedbackRating(5);
      setFeedbackComment('');
      fetchHistory(); 
    } catch {
      toast.error('Không thể gửi đánh giá');
    }
    setSubmittingFeedback(false);
  };

  if (!isLoggedIn) return <div className="min-h-screen bg-custom-bg flex items-center justify-center"><EmptyState title="Vui lòng đăng nhập" description="Đăng nhập để xem đơn hàng" /></div>;
  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-sm text-text-secondary">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <ChevronRight size={14} className="mx-2" />
          <span className="text-text-primary font-medium">Đơn hàng của tôi</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-text-primary mb-8 flex items-center gap-3">
          <ClipboardList className="text-primary" size={28} /> Lịch sử đặt chỗ
        </h1>

        {bookings.length === 0 ? (
          <EmptyState icon={Package} title="Chưa có đơn hàng nào" description="Bạn sẽ thấy danh sách các tour đã đặt tại đây." />
        ) : (
          <div className="space-y-8">
            {bookings.map((order) => (
              <div key={order.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden animate-fade-in-up">
                <div className="bg-gray-50/50 px-6 py-4 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-text-muted uppercase tracking-wider">Mã đơn: {order.id}</span>
                      <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded-md ${BOOKING_STATUS_MAP[order.status]?.color}`}>
                        {BOOKING_STATUS_MAP[order.status]?.label}
                      </span>
                    </div>
                    <p className="text-[11px] text-text-muted mt-1 italic">
                      Đặt ngày: {new Date(order.createdAt).toLocaleString('vi-VN')}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-[10px] text-text-muted font-bold uppercase">Tổng thanh toán</p>
                      <PriceTag price={order.finalAmount} size="md" />
                    </div>

                    {/* SỬA: Nút Hủy gọi openCancelModal */}
                    {(order.status === 'PAID' || order.status === 'SUCCESS') && (
                      <button
                        onClick={() => openCancelModal(order.id)}
                        className="p-2 text-danger hover:bg-red-50 rounded-xl transition-colors border border-red-100"
                        title="Hủy đơn hàng"
                      >
                        <XCircle size={18} />
                      </button>
                    )}

                    {order.status === 'PENDING' && (
                      <Link to="/cart" className="flex items-center gap-1.5 px-4 py-2 bg-primary text-white rounded-xl text-xs font-black">
                        <ShoppingCart size={16} /> THANH TOÁN
                      </Link>
                    )}
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {order.items?.map((item) => (
                    <div key={item.id} className="flex gap-4 group">
                      <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-gray-100 border border-gray-50">
                        <img src={item.service?.imageUrl} alt={item.capturedName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-text-primary text-sm truncate pr-2">{item.capturedName}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${STATUS_MAP[item.status]?.color}`}>
                            {STATUS_MAP[item.status]?.label}
                          </span>
                        </div>
                        <div className="flex gap-3 mt-1 text-[10px] text-text-secondary font-medium">
                          <span>{item.bookedDate}</span>
                          <span>{item.startTimeSnap}</span>
                          <span className="text-primary font-bold">SL: {item.quantity}</span>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <PriceTag price={item.capturedPrice * item.quantity} size="sm" />
                          
                          {/* GIỮ NGUYÊN LOGIC FEEDBACK CỦA BẠN */}
                          {order.status === 'SUCCESS' && item.status === 'CONFIRMED' && (
                            <button onClick={() => setFeedbackModal(item.id)} className="flex items-center gap-1 px-3 py-1.5 bg-amber-50 text-amber-600 rounded-lg text-[11px] font-bold hover:bg-amber-100 border border-amber-100">
                              <Star size={12} className="fill-amber-600" /> Đánh giá
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL HỦY ĐƠN MỚI (Thay cho window.confirm) */}
      <AnimatePresence>
        {cancelModal.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isCancelling && setCancelModal({ isOpen: false, bookingId: null })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[32px] p-8 max-w-sm w-full z-10 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl font-black text-text-primary mb-2">Xác nhận hủy đơn?</h2>
              <p className="text-sm text-text-secondary mb-8">
                Hệ thống sẽ hoàn tiền tự động nếu đơn hàng chưa quá 24h. Bạn chắc chắn chứ?
              </p>
              <div className="flex gap-3">
                <button
                  disabled={isCancelling}
                  onClick={() => setCancelModal({ isOpen: false, bookingId: null })}
                  className="flex-1 py-3 rounded-xl font-bold text-text-secondary hover:bg-gray-100 transition-colors"
                >
                  Quay lại
                </button>
                <button
                  disabled={isCancelling}
                  onClick={confirmCancel}
                  className="flex-1 py-3 rounded-xl bg-red-500 text-white font-black hover:bg-red-600 transition-all shadow-lg shadow-red-200"
                >
                  {isCancelling ? 'Đang hủy...' : 'Hủy ngay'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal Feedback giữ nguyên như cũ... */}
      <AnimatePresence>
        {feedbackModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFeedbackModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-3xl p-8 max-w-md w-full z-10 shadow-2xl"
            >
              <h2 className="text-xl font-black text-text-primary mb-2 text-center">Trải nghiệm của bạn?</h2>
              <p className="text-xs text-text-secondary text-center mb-6">Đánh giá của bạn giúp cộng đồng chọn tour tốt hơn</p>
              <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button key={s} onClick={() => setFeedbackRating(s)} className="transition-all hover:scale-125">
                    <Star size={36} className={s <= feedbackRating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'} />
                  </button>
                ))}
              </div>
              <textarea
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                placeholder="Dịch vụ có tốt không?..."
                className="w-full px-5 py-4 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/10 bg-gray-50 h-32 resize-none mb-6 transition-all"
              />
              <div className="flex gap-3">
                <button onClick={() => setFeedbackModal(null)} className="flex-1 py-3.5 rounded-xl font-bold text-text-secondary hover:bg-gray-100 transition-colors">Để sau</button>
                <button onClick={handleSubmitFeedback} disabled={submittingFeedback || !feedbackComment.trim()} className="flex-1 py-3.5 rounded-xl bg-primary text-white font-bold hover:opacity-90 flex items-center justify-center gap-2 shadow-lg shadow-primary/20">
                  {submittingFeedback ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={18} /> Gửi ngay</>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyBookings;