import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Upload, Info } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import useAuthStore from '../../store/useAuthStore';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { value: 'TOUR', label: 'Tour' },
  { value: 'HOTEL', label: 'Khách sạn' },
  { value: 'TRANSPORT', label: 'Di chuyển' },
  { value: 'PHOTOGRAPHY', label: 'Chụp ảnh' },
  { value: 'FOOD', label: 'Ẩm thực' },
  { value: 'ENTERTAINMENT', label: 'Giải trí' },
];

const ServiceForm = ({ service, onClose, onSuccess }) => {
  const { user } = useAuthStore();
  
  // Phân biệt trạng thái: Edit (có id) vs Tạo món con (có parentId) vs Tạo mới hoàn toàn
  const isEdit = !!service?.id;
  const parentId = service?.parentId; 

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: 'TOUR',
    type: 'SINGLE',
    imageUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        category: service.category || 'TOUR',
        type: service.type || (parentId ? 'SINGLE' : 'SINGLE'),
        imageUrl: service.imageUrl || '',
      });
    }
  }, [service, parentId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openCloudinaryWidget = () => {
    if (window.cloudinary) {
      const widget = window.cloudinary.createUploadWidget(
        {
          cloudName: 'dcrq2xo0b',
          uploadPreset: 'tour_upload',
          sources: ['local', 'url', 'camera'],
          multiple: false,
          maxFileSize: 5000000,
          cropping: true,
          croppingAspectRatio: 16 / 9,
          resourceType: 'image',
        },
        (error, result) => {
          if (!error && result?.event === 'success') {
            setFormData((prev) => ({ ...prev, imageUrl: result.info.secure_url }));
            toast.success('Tải ảnh thành công!');
          }
        }
      );
      widget.open();
    } else {
      toast.error('Cloudinary chưa sẵn sàng. Thử lại sau hoặc dán URL.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      toast.error('Vui lòng điền tên và giá');
      return;
    }
    setIsSubmitting(true);

    // Cấu trúc Payload gửi về Backend Spring Boot
    const payload = {
      ...formData,
      price: parseFloat(formData.price),
      provider: { id: user.id },
      // Tự động ghim cha nếu đây là mode tạo món con cho Combo
      parent: parentId ? { id: parentId } : null
    };

    try {
      if (isEdit) {
        await serviceApi.updateService(service.id, user.id, payload);
        toast.success('Cập nhật thành công!');
      } else {
        await serviceApi.createService(payload);
        toast.success(parentId ? 'Đã thêm món mới vào Combo!' : 'Tạo dịch vụ thành công!');
      }
      onSuccess();
    } catch (err) {
      toast.error('Thao tác thất bại. Vui lòng kiểm tra lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-8 z-10 max-h-[90vh] overflow-y-auto"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors">
          <X size={24} />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-text-primary uppercase tracking-tight">
            {isEdit ? 'Chỉnh sửa dịch vụ' : parentId ? 'Thêm món vào Combo' : 'Tạo dịch vụ mới'}
          </h2>
          {parentId && (
            <div className="mt-2 flex items-center gap-1.5 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 w-fit">
              <Info size={14} />
              <span className="text-[10px] font-bold uppercase">Đang tạo món con cho: {parentId}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Image Section */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-2 ml-1">Hình ảnh</label>
            {formData.imageUrl ? (
              <div className="relative rounded-2xl overflow-hidden h-44 mb-3 border border-gray-100 shadow-sm group">
                <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button
                    type="button"
                    onClick={() => setFormData({ ...formData, imageUrl: '' })}
                    className="bg-white text-danger p-2 rounded-xl shadow-lg hover:scale-110 transition-transform"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={openCloudinaryWidget}
                className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 text-text-muted group"
              >
                <Upload size={24} className="group-hover:text-primary transition-colors" />
                <span className="text-xs font-bold uppercase">Tải ảnh lên Cloudinary</span>
              </button>
            )}
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              className="w-full mt-2 px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50"
              placeholder="Hoặc dán URL ảnh trực tiếp..."
            />
          </div>

          {/* Name & Desc */}
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Tên dịch vụ *</label>
            <input
              type="text" name="name" value={formData.name} onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 font-medium"
              placeholder="VD: Tour Ngắm Hoàng Hôn Trên Vịnh" required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Mô tả chi tiết</label>
            <textarea
              name="description" value={formData.description} onChange={handleChange} rows={3}
              className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 resize-none font-medium"
              placeholder="Thông tin lịch trình, dịch vụ đi kèm..."
            />
          </div>

          {/* Price & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Giá (VND) *</label>
              <input
                type="number" name="price" value={formData.price} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 font-bold text-primary"
                placeholder="0" required min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Thời lượng</label>
              <input
                type="text" name="duration" value={formData.duration} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50"
                placeholder="VD: 4 ngày 3 đêm"
              />
            </div>
          </div>

          {/* Category & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Danh mục</label>
              <select
                name="category" value={formData.category} onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 font-semibold"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase mb-1.5 ml-1">Loại hình</label>
              <select
                name="type" 
                value={formData.type} 
                onChange={handleChange}
                disabled={!!parentId} // Khóa Type nếu đang tạo món con (mặc định SINGLE)
                className={`w-full px-4 py-3 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary bg-gray-50/50 font-semibold ${parentId ? 'opacity-50' : ''}`}
              >
                <option value="SINGLE">Dịch vụ đơn lẻ</option>
                <option value="COMBO">Gói Combo</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full gradient-primary text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-2 mt-4"
          >
            {isSubmitting ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              isEdit ? 'Cập nhật dịch vụ' : parentId ? 'Thêm vào Combo' : 'Phát hành dịch vụ'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ServiceForm;