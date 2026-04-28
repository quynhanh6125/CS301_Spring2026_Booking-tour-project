import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, MessageSquare, ChevronRight, Filter, TrendingUp, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';
import { feedbackApi } from '../../api/feedbackApi';
import { serviceApi } from '../../api/serviceApi';
import useAuthStore from '../../store/useAuthStore';
import RatingStars from '../../components/ui/RatingStars';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import EmptyState from '../../components/ui/EmptyState';
import toast from 'react-hot-toast';

const Reviews = () => {
  const { user } = useAuthStore();
  const [feedbacks, setFeedbacks] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      setIsLoading(true);
      Promise.all([
        feedbackApi.getProviderFeedbacks(user.id),
        serviceApi.getProviderServices(user.id)
      ])
        .then(([fbRes, svcRes]) => {
          setFeedbacks(fbRes.data);
          setServices(svcRes.data);
        })
        .catch(() => toast.error("Không thể tải dữ liệu đánh giá"))
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  // SỬA TẠI ĐÂY: Đổi fb.item thành fb.bookingItem để khớp với Backend
  const filteredFeedbacks = selectedServiceId
    ? feedbacks.filter(fb => fb.bookingItem?.service?.id === selectedServiceId)
    : feedbacks;

  const currentStats = {
    avg: filteredFeedbacks.length > 0 
      ? (filteredFeedbacks.reduce((acc, curr) => acc + curr.rating, 0) / filteredFeedbacks.length).toFixed(1)
      : 0,
    count: filteredFeedbacks.length
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center text-sm text-text-secondary">
          <Link to="/provider/dashboard" className="hover:text-primary transition-colors font-medium">Dashboard</Link>
          <ChevronRight size={14} className="mx-2 text-text-muted" />
          <span className="text-text-primary font-bold uppercase tracking-tight">Đánh giá khách hàng</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-black text-text-primary flex items-center gap-3">
              <Star className="text-amber-500 fill-amber-500" size={32} />
              Quản lý đánh giá
            </h1>
            <p className="text-text-secondary text-sm mt-1 uppercase font-bold tracking-widest text-primary/80">
              Phản hồi trực tiếp từ người dùng
            </p>
          </div>

          <div className="bg-white rounded-2xl px-6 py-4 border border-gray-100 shadow-sm flex items-center gap-4">
             <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <TrendingUp size={20} />
             </div>
             <div>
                <div className="flex items-center gap-2">
                   <span className="text-2xl font-black text-text-primary">{currentStats.avg}</span>
                   <Star size={16} className="fill-amber-400 text-amber-400 mb-1" />
                </div>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-tighter">
                   Trung bình {currentStats.count} đánh giá
                </p>
             </div>
          </div>
        </div>

        {/* BỘ LỌC DỊCH VỤ */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 ml-1 text-xs font-black text-text-muted uppercase tracking-widest">
            <Filter size={14} /> Lọc theo dịch vụ:
          </div>
          <div className="flex gap-2 overflow-x-auto pb-3 custom-scrollbar">
            <button
              onClick={() => setSelectedServiceId(null)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                ${!selectedServiceId 
                  ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white border-gray-100 text-text-secondary hover:border-primary/30'}`}
            >
              Tất cả dịch vụ
            </button>
            {services.map(svc => (
              <button
                key={svc.id}
                onClick={() => setSelectedServiceId(svc.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border
                  ${selectedServiceId === svc.id 
                    ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                    : 'bg-white border-gray-100 text-text-secondary hover:border-primary/30'}`}
              >
                {svc.name}
              </button>
            ))}
          </div>
        </div>

        {/* DANH SÁCH FEEDBACK */}
        <div className="grid grid-cols-1 gap-5">
          <AnimatePresence mode='popLayout'>
            {filteredFeedbacks.length === 0 ? (
              <EmptyState 
                key="empty"
                icon={MessageSquare} 
                title="Chưa có bình luận nào" 
                description={selectedServiceId ? "Dịch vụ này hiện chưa nhận được phản hồi nào từ khách hàng." : "Toàn bộ dịch vụ của bạn chưa có đánh giá."}
              />
            ) : (
              filteredFeedbacks.map((fb) => (
                <motion.div
                  key={fb.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* SỬA: fb.item -> fb.bookingItem */}
                    <div className="w-full md:w-40 h-28 rounded-2xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100 relative">
                      <img 
                        src={fb.bookingItem?.service?.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=300'} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                        alt="Service"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-2">
                        <span className="text-[9px] font-black text-white uppercase tracking-tighter truncate">
                           {fb.bookingItem?.service?.category || 'Hoạt động'}
                        </span>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-black text-text-primary text-base leading-tight truncate mb-1">
                             {fb.bookingItem?.service?.name || fb.bookingItem?.capturedName}
                          </h3>
                          <div className="flex items-center gap-3">
                            <RatingStars rating={fb.rating} size="sm" showValue={true} />
                            <span className="h-1 w-1 bg-gray-300 rounded-full" />
                            {/* HIỂN THỊ MÃ ĐƠN HÀNG TẠI ĐÂY */}
                            <span className="text-[10px] font-bold text-text-muted uppercase">
                               Mã đơn: #{fb.bookingItem?.booking?.id || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <div className="text-[11px] font-bold text-text-muted bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-100">
                          {new Date(fb.createdAt).toLocaleDateString('vi-VN')}
                        </div>
                      </div>

                      <div className="bg-primary-50/50 rounded-2xl p-5 relative border border-primary-50">
                        <p className="text-sm text-text-primary leading-relaxed font-medium italic">
                          "{fb.comment || 'Khách hàng chỉ để lại đánh giá sao.'}"
                        </p>
                        
                        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                             <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center text-xs font-black text-white shadow-sm ring-2 ring-white">
                                {fb.customer?.username?.charAt(0).toUpperCase() || 'U'}
                             </div>
                             <div>
                                <p className="text-[11px] font-black text-text-primary uppercase tracking-tighter">
                                   {fb.customer?.username}
                                </p>
                                <p className="text-[9px] font-bold text-text-muted italic">Khách hàng xác thực</p>
                             </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 text-success font-black text-[10px] uppercase tracking-widest">
                             <LayoutGrid size={12} /> {fb.bookingItem?.service?.type || 'SINGLE'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Reviews;