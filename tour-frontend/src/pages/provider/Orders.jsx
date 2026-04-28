import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Thêm AnimatePresence
import { ClipboardList, CheckCircle, XCircle, CalendarDays, Clock, Filter, AlertCircle } from 'lucide-react';
import { bookingApi } from '../../api/bookingApi';
import useAuthStore from '../../store/useAuthStore';
import PriceTag from '../../components/ui/PriceTag';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const STATUS_MAP = {
  PENDING_PROVIDER: { label: 'Chờ duyệt', color: 'bg-amber-100 text-amber-700' },
  CONFIRMED: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700' },
  REJECTED: { label: 'Đã từ chối', color: 'bg-red-100 text-red-700' },
  CANCELLED: { label: 'Đã hủy', color: 'bg-gray-100 text-gray-600' },
};

const Orders = () => {
  const { user } = useAuthStore();
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState(null);

  // MỚI: State quản lý Action Modal
  const [actionModal, setActionModal] = useState({ 
    isOpen: false, 
    type: null, // 'CONFIRM' hoặc 'REJECT'
    itemId: null 
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchItems = () => {
    if (!user) return;
    setIsLoading(true);
    bookingApi.getProviderItems(user.id)
      .then((res) => setItems(res.data))
      .catch(() => toast.error('Không thể tải đơn hàng'))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchItems, [user]);

  // MỚI: Hàm mở Modal thay vì gọi trực tiếp API
  const openActionModal = (itemId, type) => {
    setActionModal({ isOpen: true, type, itemId });
  };

  // MỚI: Hàm thực thi hành động sau khi bấm nút trên Modal
  const handleConfirmAction = async () => {
    setIsProcessing(true);
    try {
      if (actionModal.type === 'CONFIRM') {
        await bookingApi.confirmItem(actionModal.itemId, user.id);
        toast.success('Đã xác nhận đơn hàng thành công');
      } else {
        await bookingApi.rejectItem(actionModal.itemId, user.id);
        toast.success('Đã từ chối đơn hàng và hoàn tiền cho khách');
      }
      fetchItems();
      setActionModal({ isOpen: false, type: null, itemId: null });
    } catch {
      toast.error('Thao tác thất bại, vui lòng thử lại');
    } finally {
      setIsProcessing(false);
    }
  };

  const filtered = filterStatus
    ? items.filter((item) => item.status === filterStatus)
    : items;

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg pb-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-black text-text-primary flex items-center gap-3 uppercase tracking-tight">
            <ClipboardList className="text-primary" size={28} />
            Quản lý đơn hàng
          </h1>
          <p className="text-text-secondary text-sm mt-1 font-medium">{items.length} yêu cầu từ khách hàng</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Filters (giữ nguyên logic của bạn) */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          <button
            onClick={() => setFilterStatus(null)}
            className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-2 shadow-sm ${
              !filterStatus ? 'bg-primary text-white shadow-primary/20' : 'bg-white text-text-secondary border border-gray-100 hover:bg-gray-50'
            }`}
          >
            <Filter size={14} /> TẤT CẢ ({items.length})
          </button>
          {Object.entries(STATUS_MAP).map(([key, val]) => (
            <button
              key={key}
              onClick={() => setFilterStatus(key)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all border ${
                filterStatus === key 
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' 
                  : 'bg-white text-text-secondary border-gray-100 hover:bg-gray-50'
              }`}
            >
              {val.label.toUpperCase()} ({items.filter((i) => i.status === key).length})
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={ClipboardList} title="Không có đơn hàng" description={filterStatus ? 'Không có đơn hàng nào ở trạng thái này.' : 'Chưa có khách hàng nào đặt dịch vụ của bạn.'} />
        ) : (
          <div className="space-y-5">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[32px] p-6 border border-gray-50 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-full sm:w-28 h-28 rounded-3xl overflow-hidden flex-shrink-0 shadow-inner">
                    <img src={item.service?.imageUrl || 'https://via.placeholder.com/300'} alt={item.capturedName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-black text-text-primary text-lg tracking-tight truncate">{item.capturedName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-md border border-primary/10 uppercase">Mã: {item.id}</span>
                           <p className="text-xs text-text-muted font-medium">Khách: <span className="text-text-primary font-bold">{item.booking?.customer?.username || 'Khách vãng lai'}</span></p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${STATUS_MAP[item.status]?.color}`}>
                        {STATUS_MAP[item.status]?.label}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-[11px] text-text-secondary font-medium mb-4">
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg"><CalendarDays size={14} className="text-primary" /> {item.bookedDate}</span>
                      <span className="flex items-center gap-1.5 bg-gray-50 px-3 py-1 rounded-lg"><Clock size={14} className="text-primary" /> {item.startTimeSnap}</span>
                      <span className="flex items-center gap-1.5 bg-primary/5 text-primary px-3 py-1 rounded-lg font-black italic underline underline-offset-2">Số lượng: {item.quantity}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <PriceTag price={item.capturedPrice * item.quantity} size="md" />
                      
                      {item.status === 'PENDING_PROVIDER' && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => openActionModal(item.id, 'REJECT')}
                            className="flex items-center gap-1.5 px-5 py-2.5 border-2 border-red-50 text-red-500 rounded-2xl text-xs font-black hover:bg-red-50 transition-all"
                          >
                            <XCircle size={16} /> Từ chối
                          </button>
                          <button
                            onClick={() => openActionModal(item.id, 'CONFIRM')}
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-green-500 text-white rounded-2xl text-xs font-black hover:bg-green-600 transition-all shadow-lg shadow-green-100"
                          >
                            <CheckCircle size={16} /> Xác nhận ngay
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* MỚI: ACTION MODAL CHO PROVIDER */}
      <AnimatePresence>
        {actionModal.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isProcessing && setActionModal({ isOpen: false, type: null, itemId: null })}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white rounded-[40px] p-10 max-w-sm w-full z-10 shadow-2xl text-center"
            >
              <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 ${
                actionModal.type === 'CONFIRM' ? 'bg-green-50 animate-bounce' : 'bg-red-50'
              }`}>
                {actionModal.type === 'CONFIRM' ? (
                  <CheckCircle size={48} className="text-green-500" />
                ) : (
                  <AlertCircle size={48} className="text-red-500" />
                )}
              </div>
              
              <h2 className="text-2xl font-black text-text-primary mb-3 tracking-tight">
                {actionModal.type === 'CONFIRM' ? 'Xác nhận đơn?' : 'Từ chối đơn?'}
              </h2>
              <p className="text-sm text-text-secondary mb-10 leading-relaxed font-medium">
                {actionModal.type === 'CONFIRM' 
                  ? 'Quoc Anh đã kiểm tra lịch trình và sẵn sàng phục vụ khách hàng này chứ?'
                  : 'Hệ thống sẽ hoàn tiền tự động cho khách hàng. Hành động này không thể hoàn tác!'}
              </p>

              <div className="flex gap-3">
                <button
                  disabled={isProcessing}
                  onClick={() => setActionModal({ isOpen: false, type: null, itemId: null })}
                  className="flex-1 py-4 rounded-2xl font-bold text-text-secondary hover:bg-gray-100 transition-colors"
                >
                  Đóng
                </button>
                <button
                  disabled={isProcessing}
                  onClick={handleConfirmAction}
                  className={`flex-[1.5] py-4 rounded-2xl text-white font-black transition-all shadow-xl ${
                    actionModal.type === 'CONFIRM' 
                      ? 'bg-green-500 hover:bg-green-600 shadow-green-200' 
                      : 'bg-red-500 hover:bg-red-600 shadow-red-200'
                  }`}
                >
                  {isProcessing ? 'Đang xử lý...' : (actionModal.type === 'CONFIRM' ? 'Xác nhận' : 'Từ chối')}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;