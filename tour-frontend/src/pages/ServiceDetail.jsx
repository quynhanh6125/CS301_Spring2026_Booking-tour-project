import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Clock, Users, CalendarDays, Minus, Plus, ShoppingCart, Star, LayoutGrid, Check } from 'lucide-react';
import { serviceApi } from '../api/serviceApi';
import { bookingApi } from '../api/bookingApi';
import { feedbackApi } from '../api/feedbackApi';
import useAuthStore from '../store/useAuthStore';
import useCartStore from '../store/useCartStore';
import RatingStars from '../components/ui/RatingStars';
import PriceTag from '../components/ui/PriceTag';
import { PageLoader } from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const CATEGORY_LABELS = {
  HOTEL: 'Khách sạn', TRANSPORT: 'Di chuyển', TOUR: 'Tour',
  PHOTOGRAPHY: 'Chụp ảnh', FOOD: 'Ẩm thực', ENTERTAINMENT: 'Giải trí',
};

const ServiceDetail = () => {
  const { id } = useParams();
  const { user, isLoggedIn } = useAuthStore();
  const { addItem } = useCartStore();

  const [service, setService] = useState(null);
  const [subServices, setSubServices] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Booking state
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      serviceApi.getServiceById(id),
      feedbackApi.getServiceFeedbacks(id),
      feedbackApi.getAverageRating(id),
    ])
      .then(([svcRes, fbRes, ratingRes]) => {
        setService(svcRes.data);
        setFeedbacks(fbRes.data);
        setAvgRating(ratingRes.data || 0);
        // Nếu là COMBO thì mới lấy danh sách dịch vụ con
        if (svcRes.data.type === 'COMBO') {
          serviceApi.getSubServices(id).then((r) => setSubServices(r.data));
        }
      })
      .catch(() => toast.error('Không thể tải dịch vụ'))
      .finally(() => setIsLoading(false));
  }, [id]);

  // Fetch slots khi chọn ngày
  useEffect(() => {
    if (!selectedDate || !id) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    bookingApi.getAvailableSlots(id, selectedDate)
      .then((res) => setAvailableSlots(res.data))
      .catch(() => setAvailableSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      toast.error('Vui lòng đăng nhập để đặt tour');
      return;
    }
    if (!selectedDate || !selectedSlot) {
      toast.error('Vui lòng chọn ngày và khung giờ');
      return;
    }
    setAddingToCart(true);
    try {
      await addItem({
        customerId: user.id,
        serviceId: id,
        bookedDate: selectedDate,
        startTime: selectedSlot.startTime,
        quantity,
      });
    } catch {
      // Logic đã được xử lý trong store
    } finally {
      setAddingToCart(false);
    }
  };

  if (isLoading) return <PageLoader />;
  if (!service) return <div className="text-center py-20 font-bold">Không tìm thấy dịch vụ</div>;

  const fallbackImg = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=80';
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-custom-bg pb-12">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-text-secondary">
            <Link to="/" className="hover:text-primary transition-colors">Trang chủ</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-muted">{CATEGORY_LABELS[service.category]}</span>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-primary font-bold truncate max-w-[200px]">{service.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* CỘT TRÁI: THÔNG TIN DỊCH VỤ */}
          <div className="flex-1">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-3xl overflow-hidden mb-8 shadow-sm">
              <img src={service.imageUrl || fallbackImg} alt={service.name} className="w-full h-[450px] object-cover" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-primary-50 text-primary text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">
                  {CATEGORY_LABELS[service.category]}
                </span>
                {service.type === 'COMBO' && (
                  <span className="gradient-primary text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg shadow-sm">
                    Gói tiết kiệm COMBO
                  </span>
                )}
                {service.duration && (
                  <span className="flex items-center text-text-secondary text-xs font-medium bg-gray-100 px-3 py-1 rounded-lg">
                    <Clock size={13} className="mr-1" /> {service.duration}
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-black text-text-primary mb-4 leading-tight">{service.name}</h1>

              <div className="flex items-center gap-4 mb-8">
                <RatingStars rating={avgRating} count={feedbacks.length} size="md" />
              </div>

              {/* MÔ TẢ */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 mb-8 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-4 uppercase tracking-tight">Chi tiết dịch vụ</h2>
                <p className="text-text-secondary leading-relaxed whitespace-pre-line text-[15px]">
                  {service.description || 'Chưa có mô tả chi tiết cho dịch vụ này.'}
                </p>
              </div>

              {/* DANH SÁCH MÓN CON (Dành riêng cho COMBO) */}
              {service.type === 'COMBO' && subServices.length > 0 && (
                <div className="bg-white rounded-3xl p-8 border border-gray-100 mb-8 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                      <LayoutGrid size={20} />
                    </div>
                    <h2 className="text-xl font-black text-text-primary uppercase tracking-tight">
                      Gói combo bao gồm
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {subServices.map((sub) => (
                      <div key={sub.id} className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                        <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                          <img
                            src={sub.imageUrl || fallbackImg}
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-text-primary text-sm truncate">{sub.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black uppercase text-text-muted bg-white px-2 py-0.5 rounded border border-gray-100">
                              {CATEGORY_LABELS[sub.category]}
                            </span>
                            <span className="text-[10px] text-success font-bold flex items-center gap-0.5">
                              <Check size={10} /> Đã bao gồm
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PHẦN ĐÁNH GIÁ (GIỮ NGUYÊN LOGIC CỦA BẠN) */}
              <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h2 className="text-xl font-black text-text-primary mb-6 uppercase tracking-tight">Đánh giá cộng đồng</h2>
                {feedbacks.length === 0 ? (
                  <p className="text-text-muted text-sm text-center py-10 italic">Chưa có đánh giá nào cho dịch vụ này</p>
                ) : (
                  <div className="space-y-6">
                    {feedbacks.map((fb) => (
                      <div key={fb.id} className="border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-text-secondary">
                              {fb.customer?.username?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-text-primary">{fb.customer?.username}</p>
                              <RatingStars rating={fb.rating} showValue={false} size="xs" />
                            </div>
                          </div>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed ml-13">{fb.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* CỘT PHẢI: BẢNG ĐẶT CHỖ */}
          <div className="lg:w-96">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-3xl p-8 border border-gray-100 sticky top-24 shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
            >
              <div className="flex items-baseline justify-between mb-6">
                <PriceTag price={service.price} size="xl" />
                <span className="text-text-muted text-sm font-bold uppercase">/ người</span>
              </div>

              <div className="space-y-5">
                {/* Ngày */}
                <div>
                  <label className="block text-[11px] font-black text-text-muted uppercase mb-2 ml-1">1. Chọn ngày khởi hành</label>
                  <input type="date" value={selectedDate} min={today} onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold"
                  />
                </div>

                {/* Khung giờ */}
                {selectedDate && (
                  <div>
                    <label className="block text-[11px] font-black text-text-muted uppercase mb-2 ml-1">2. Chọn khung giờ</label>
                    {slotsLoading ? (
                      <div className="space-y-2">
                        {[1, 2].map((i) => <div key={i} className="skeleton h-14 rounded-2xl" />)}
                      </div>
                    ) : availableSlots.length === 0 ? (
                      <p className="text-danger text-xs p-4 bg-red-50 rounded-2xl font-bold text-center">Rất tiếc, đã hết chỗ cho ngày này</p>
                    ) : (
                      <div className="space-y-2">
                        {availableSlots.map((slot) => (
                          <button key={slot.slotId} onClick={() => setSelectedSlot(slot)} disabled={slot.remainingSeats <= 0}
                            className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all
                              ${selectedSlot?.slotId === slot.slotId ? 'border-primary bg-primary-50 text-primary shadow-sm' : 'border-gray-100 bg-white hover:border-gray-300'}
                              ${slot.remainingSeats <= 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                          >
                            <span className="font-black text-sm">{slot.startTime}</span>
                            <span className={`text-[10px] font-black uppercase ${slot.remainingSeats <= 3 ? 'text-danger' : 'text-text-muted'}`}>
                              Còn {slot.remainingSeats} chỗ
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Số lượng */}
                <div>
                  <label className="block text-[11px] font-black text-text-muted uppercase mb-2 ml-1">3. Số lượng khách</label>
                  <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl p-1">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Minus size={18} /></button>
                    <span className="flex-1 text-center font-black text-text-primary">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-primary transition-colors"><Plus size={18} /></button>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-text-secondary">Tổng cộng</span>
                    <PriceTag price={service.price * quantity} size="lg" />
                  </div>

                  <button onClick={handleAddToCart} disabled={addingToCart || !selectedDate || !selectedSlot}
                    className="w-full gradient-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {addingToCart ? <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" /> : <><ShoppingCart size={20} /> Đặt ngay</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;