import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Package, ClipboardList, TrendingUp, Star, DollarSign, Plus, ArrowUpRight } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import useAuthStore from '../../store/useAuthStore';
import PriceTag from '../../components/ui/PriceTag';
import { PageLoader } from '../../components/ui/LoadingSpinner';

const statCard = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

const Dashboard = () => {
  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    serviceApi.getProviderDashboard(user.id)
      .then((res) => setDashboard(res.data))
      .catch((err) => console.error("Lỗi Dashboard:", err))
      .finally(() => setIsLoading(false));
  }, [user]);

  if (isLoading) return <PageLoader />;

  const stats = [
    { label: 'Tổng dịch vụ', value: dashboard?.totalServices || 0, icon: Package, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Tổng đơn đặt', value: dashboard?.totalBookings || 0, icon: ClipboardList, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Doanh thu', value: null, price: dashboard?.totalRevenue || 0, icon: DollarSign, color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Đánh giá TB', value: dashboard?.averageRating?.toFixed(1) || '0.0', icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="min-h-screen bg-custom-bg pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <h1 className="text-3xl font-black text-text-primary flex items-center gap-3 tracking-tight uppercase">
                <LayoutDashboard className="text-primary" size={32} />
                Bảng điều khiển
              </h1>
              <p className="text-text-secondary text-sm mt-1">
                Chào mừng đối tác <span className="font-bold text-primary">{dashboard?.businessName || user?.username}</span> quay trở lại!
              </p>
            </div>
            <Link
              to="/provider/services"
              className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={20} /> Tạo dịch vụ mới
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats cards */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                variants={statCard}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 ${s.bg} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <Icon className={s.color} size={24} />
                  </div>
                  <div className="p-1.5 bg-success-light/30 rounded-lg text-success">
                    <TrendingUp size={16} />
                  </div>
                </div>
                <p className="text-text-muted text-xs font-bold uppercase tracking-wider mb-1">{s.label}</p>
                {s.price !== undefined && s.price !== null ? (
                  <PriceTag price={s.price} size="lg" />
                ) : (
                  <p className="text-3xl font-black text-text-primary tracking-tight">{s.value}</p>
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action 1: Quản lý dịch vụ */}
          <Link
            to="/provider/services"
            className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <Package className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-text-primary text-xl mb-2">Quản lý dịch vụ</h3>
              <p className="text-text-secondary text-sm leading-relaxed">Tạo mới, chỉnh sửa thông tin hoặc thiết lập cấu trúc cho các gói combo của bạn.</p>
              <div className="mt-6 flex items-center gap-2 text-primary font-bold text-sm">
                Truy cập ngay <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-primary/5 group-hover:text-primary/10 transition-colors">
              <Package size={120} />
            </div>
          </Link>

          {/* Action 2: Đơn hàng */}
          <Link
            to="/provider/orders"
            className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-50 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <ClipboardList className="text-emerald-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-text-primary text-xl mb-2">Đơn đặt hàng</h3>
              <p className="text-text-secondary text-sm leading-relaxed">Theo dõi danh sách khách hàng đặt chỗ, xác nhận hoặc từ chối các yêu cầu mới.</p>
              <div className="mt-6 flex items-center gap-2 text-emerald-600 font-bold text-sm">
                Kiểm tra đơn hàng <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors">
              <ClipboardList size={120} />
            </div>
          </Link>

          {/* Action 3: Đánh giá */}
          <Link
            to="/provider/reviews"
            className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-50 transition-all group relative overflow-hidden"
          >
            <div className="relative z-10">
              <Star className="text-amber-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
              <h3 className="font-black text-text-primary text-xl mb-2">Đánh giá khách hàng</h3>
              <p className="text-text-secondary text-sm leading-relaxed">Lắng nghe phản hồi từ khách hàng để cải thiện chất lượng dịch vụ của bạn.</p>
              <div className="mt-6 flex items-center gap-2 text-amber-600 font-bold text-sm">
                Xem phản hồi <ArrowUpRight size={16} />
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 text-amber-500/5 group-hover:text-amber-500/10 transition-colors">
              <Star size={120} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;