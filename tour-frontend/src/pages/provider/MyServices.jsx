import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, RotateCcw, Clock, EyeOff, LayoutGrid } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import useAuthStore from '../../store/useAuthStore';
import PriceTag from '../../components/ui/PriceTag';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import ServiceForm from '../../components/provider/ServiceForm';
import ComboMemberManager from '../../components/provider/ComboMemberManager'; // Import modal quản lý thành viên
import toast from 'react-hot-toast';

const CATEGORY_LABELS = {
  HOTEL: 'Khách sạn', TRANSPORT: 'Di chuyển', TOUR: 'Tour',
  PHOTOGRAPHY: 'Chụp ảnh', FOOD: 'Ẩm thực', ENTERTAINMENT: 'Giải trí',
};

const MyServices = () => {
  const { user } = useAuthStore();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [managingCombo, setManagingCombo] = useState(null); // State quản lý combo đang được mở cấu trúc

  const fetchServices = () => {
    if (!user) return;
    setIsLoading(true);
    serviceApi.getProviderServices(user.id)
      .then((res) => setServices(res.data))
      .catch(() => toast.error('Không thể tải danh sách dịch vụ'))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchServices, [user]);

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Ẩn dịch vụ này?')) return;
    try {
      await serviceApi.deleteService(serviceId, user.id);
      toast.success('Đã ẩn dịch vụ');
      fetchServices();
    } catch {
      toast.error('Không thể ẩn dịch vụ');
    }
  };

  const handleRestore = async (serviceId) => {
    try {
      await serviceApi.restoreService(serviceId, user.id);
      toast.success('Đã khôi phục dịch vụ');
      fetchServices();
    } catch {
      toast.error('Không thể khôi phục');
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingService(null);
    fetchServices();
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg pb-20">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-black text-text-primary flex items-center gap-3">
                <Package className="text-primary" size={28} />
                Dịch vụ của tôi
              </h1>
              <p className="text-text-secondary text-sm mt-1 uppercase font-bold tracking-tighter">
                {services.length} dịch vụ đang quản lý
              </p>
            </div>
            <button
              onClick={() => { setEditingService(null); setShowForm(true); }}
              className="gradient-primary text-white px-6 py-3 rounded-2xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
            >
              <Plus size={20} /> Tạo dịch vụ mới
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {services.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Chưa có dịch vụ"
            description="Tạo dịch vụ đầu tiên để bắt đầu kinh doanh ngay hôm nay."
            action={() => setShowForm(true)}
            actionLabel="Tạo dịch vụ ngay"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((svc) => (
              <motion.div
                key={svc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all ${!svc.isActive ? 'opacity-60 grayscale-[0.5]' : ''}`}
              >
                <div className="relative h-44 overflow-hidden group">
                  <img
                    src={svc.imageUrl || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600'}
                    alt={svc.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                    <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black uppercase text-text-primary shadow-sm border border-gray-100">
                      {CATEGORY_LABELS[svc.category] || svc.category}
                    </span>
                    {svc.type === 'COMBO' && (
                      <span className="gradient-primary px-3 py-1 rounded-xl text-[10px] font-black uppercase text-white shadow-md">
                        COMBO
                      </span>
                    )}
                  </div>
                  {!svc.isActive && (
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-xs font-black uppercase flex items-center gap-1.5 shadow-lg">
                        <EyeOff size={14} /> Đang ẩn
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="mb-4">
                    <h3 className="font-black text-text-primary text-lg truncate mb-1 leading-tight">{svc.name}</h3>
                    <div className="flex items-center justify-between">
                      <PriceTag price={svc.price} size="md" />
                      {svc.duration && (
                        <span className="text-text-muted text-[11px] font-bold flex items-center gap-1 uppercase">
                          <Clock size={12} /> {svc.duration}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {/* HÀNG NÚT 1: SỬA & SLOTS */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setEditingService(svc); setShowForm(true); }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text-primary hover:bg-gray-100 transition-colors"
                      >
                        <Pencil size={14} /> Sửa
                      </button>
                      <Link
                        to={`/provider/services/${svc.id}/slots`}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-text-primary hover:bg-gray-100 transition-colors"
                      >
                        <Clock size={14} /> Khung giờ
                      </Link>
                    </div>

                    {/* HÀNG NÚT 2: QUẢN LÝ COMBO & ẨN/HIỆN */}
                    <div className="flex gap-2">
                      {/* NÚT COMBO MỚI: Chỉ hiện cho loại COMBO */}
                      {svc.type === 'COMBO' && svc.isActive && (
                        <button
                          onClick={() => setManagingCombo(svc)}
                          className="flex-[2] flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-100"
                        >
                          <LayoutGrid size={14} /> Cấu trúc Combo
                        </button>
                      )}

                      {svc.isActive ? (
                        <button
                          onClick={() => handleDelete(svc.id)}
                          className="flex-1 flex items-center justify-center py-2.5 border border-red-100 rounded-xl text-danger hover:bg-red-50 transition-colors"
                          title="Ẩn dịch vụ"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRestore(svc.id)}
                          className="flex-1 flex items-center justify-center py-2.5 border border-green-100 rounded-xl text-success hover:bg-green-50 transition-colors"
                          title="Khôi phục dịch vụ"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 1. Modal Form (Sửa/Tạo mới) */}
      <AnimatePresence>
        {showForm && (
          <ServiceForm
            service={editingService}
            onClose={() => { setShowForm(false); setEditingService(null); }}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>

      {/* 2. Modal Cấu trúc Combo (Clone/Tạo con) */}
      <AnimatePresence>
        {managingCombo && (
          <ComboMemberManager
            combo={managingCombo}
            providerId={user.id}
            onClose={() => setManagingCombo(null)}
            onOpenCreateNew={(pid) => {
              // Context quan trọng: Khi bấm "Tạo mới con" từ modal Combo,
              // ta mở ServiceForm với một object "ảo" chứa parentId
              setEditingService({ 
                parentId: pid, 
                type: 'SINGLE', 
                category: managingCombo.category 
              });
              setShowForm(true);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MyServices;