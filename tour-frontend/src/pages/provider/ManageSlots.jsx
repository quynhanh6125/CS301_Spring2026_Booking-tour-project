import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Clock, Plus, Pencil, Trash2, RotateCcw, X, Users } from 'lucide-react';
import { slotApi } from '../../api/slotApi';
import useAuthStore from '../../store/useAuthStore';
import EmptyState from '../../components/ui/EmptyState';
import { PageLoader } from '../../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const ManageSlots = () => {
  const { serviceId } = useParams();
  const { user } = useAuthStore();
  const [slots, setSlots] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [formData, setFormData] = useState({ startTime: '', maxCapacity: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSlots = () => {
    setIsLoading(true);
    slotApi.getSlotsByService(serviceId)
      .then((res) => setSlots(res.data))
      .catch(() => toast.error('Không thể tải danh sách khung giờ'))
      .finally(() => setIsLoading(false));
  };

  useEffect(fetchSlots, [serviceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startTime || !formData.maxCapacity) {
      toast.error('Vui lòng điền đầy đủ');
      return;
    }
    setIsSubmitting(true);
    try {
      const payload = {
        startTime: formData.startTime,
        maxCapacity: parseInt(formData.maxCapacity),
      };
      if (editingSlot) {
        await slotApi.updateSlot(editingSlot.id, user.id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await slotApi.createSlot(serviceId, user.id, payload);
        toast.success('Tạo khung giờ thành công!');
      }
      setShowForm(false);
      setEditingSlot(null);
      setFormData({ startTime: '', maxCapacity: '' });
      fetchSlots();
    } catch {
      toast.error('Thao tác thất bại');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (slotId) => {
    if (!window.confirm('Ẩn khung giờ này?')) return;
    try {
      await slotApi.deleteSlot(slotId, user.id);
      toast.success('Đã ẩn khung giờ');
      fetchSlots();
    } catch { toast.error('Thất bại'); }
  };

  const handleRestore = async (slotId) => {
    try {
      await slotApi.restoreSlot(slotId, user.id);
      toast.success('Đã khôi phục');
      fetchSlots();
    } catch { toast.error('Thất bại'); }
  };

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-custom-bg">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-text-secondary">
            <Link to="/provider/dashboard" className="hover:text-primary">Dashboard</Link>
            <ChevronRight size={14} className="mx-2" />
            <Link to="/provider/services" className="hover:text-primary">Dịch vụ</Link>
            <ChevronRight size={14} className="mx-2" />
            <span className="text-text-primary font-medium">Quản lý khung giờ</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-text-primary flex items-center gap-3">
              <Clock className="text-primary" size={28} />
              Khung giờ khởi hành
            </h1>
            <p className="text-text-secondary text-sm mt-1">Dịch vụ: {serviceId}</p>
          </div>
          <button
            onClick={() => { setEditingSlot(null); setFormData({ startTime: '', maxCapacity: '' }); setShowForm(true); }}
            className="gradient-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md flex items-center gap-2"
          >
            <Plus size={18} /> Thêm khung giờ
          </button>
        </div>

        {slots.length === 0 ? (
          <EmptyState
            icon={Clock}
            title="Chưa có khung giờ"
            description="Tạo khung giờ đầu tiên cho dịch vụ này."
            action={() => setShowForm(true)}
            actionLabel="Tạo khung giờ"
          />
        ) : (
          <div className="space-y-3">
            {slots.map((slot) => (
              <motion.div
                key={slot.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-2xl p-5 border border-gray-100 flex items-center justify-between ${!slot.active ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 bg-primary-50 rounded-xl flex items-center justify-center">
                    <Clock className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary text-lg">{slot.startTime}</p>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Users size={14} /> Sức chứa: {slot.maxCapacity} người
                      {!slot.active && <span className="text-danger text-xs font-medium ml-2">(Đã ẩn)</span>}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingSlot(slot);
                      setFormData({ startTime: slot.startTime, maxCapacity: slot.maxCapacity });
                      setShowForm(true);
                    }}
                    className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <Pencil size={16} className="text-text-secondary" />
                  </button>
                  {slot.active ? (
                    <button onClick={() => handleDelete(slot.id)} className="p-2.5 border border-gray-200 rounded-xl hover:bg-red-50 transition-colors">
                      <Trash2 size={16} className="text-danger" />
                    </button>
                  ) : (
                    <button onClick={() => handleRestore(slot.id)} className="p-2.5 border border-gray-200 rounded-xl hover:bg-green-50 transition-colors">
                      <RotateCcw size={16} className="text-success" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Slot form modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-2xl p-8 max-w-sm w-full z-10"
            >
              <button onClick={() => setShowForm(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
              <h2 className="text-xl font-black text-text-primary mb-6">
                {editingSlot ? 'Sửa khung giờ' : 'Thêm khung giờ'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Giờ bắt đầu</label>
                  <input
                    type="time" value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">Sức chứa tối đa</label>
                  <input
                    type="number" value={formData.maxCapacity}
                    onChange={(e) => setFormData({ ...formData, maxCapacity: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50"
                    placeholder="VD: 30" required min="1"
                  />
                </div>
                <button
                  type="submit" disabled={isSubmitting}
                  className="w-full gradient-primary text-white py-3.5 rounded-xl font-bold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? '...' : editingSlot ? 'Cập nhật' : 'Tạo'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ManageSlots;
