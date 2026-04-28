import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Copy, ArrowRight, Package, Info } from 'lucide-react';
import { serviceApi } from '../../api/serviceApi';
import PriceTag from '../ui/PriceTag';
import toast from 'react-hot-toast';

const ComboMemberManager = ({ combo, providerId, onClose, onOpenCreateNew }) => {
  const [members, setMembers] = useState([]);
  const [library, setLibrary] = useState([]);
  const [mode, setMode] = useState('LIST'); // 'LIST' hoặc 'CLONE'
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mRes, allRes] = await Promise.all([
        serviceApi.getSubServices(combo.id),
        serviceApi.getProviderServices(providerId)
      ]);
      setMembers(mRes.data);
      // Lọc kho lẻ: lấy các dịch vụ SINGLE, đang hoạt động và không phải chính nó
      setLibrary(allRes.data.filter(s => s.type === 'SINGLE' && s.isActive && s.id !== combo.id));
    } catch { toast.error("Không thể tải dữ liệu combo"); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [combo.id]);

  const handleClone = async (sid) => {
    try {
      await serviceApi.addMemberToCombo(combo.id, sid, providerId);
      toast.success("Đã sao chép thành công!");
      loadData();
      setMode('LIST');
    } catch { toast.error("Lỗi khi sao chép dịch vụ"); }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-2xl h-[600px] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="font-black text-primary uppercase text-lg leading-tight">Cấu trúc: {combo.name}</h2>
            <p className="text-[10px] text-text-muted mt-1 uppercase font-bold flex items-center gap-1">
              <Info size={12}/> Quản lý các thành phần của gói combo
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors"><X size={20}/></button>
        </div>

        <div className="p-4 border-b flex gap-2 bg-white sticky top-0 z-10 shadow-sm">
          <button onClick={() => onOpenCreateNew(combo.id)} className="flex-1 py-3 bg-primary text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
            <Plus size={18}/> Tạo món con mới
          </button>
          <button onClick={() => setMode(mode === 'CLONE' ? 'LIST' : 'CLONE')} className={`flex-1 py-3 rounded-2xl font-bold text-sm border-2 transition-all ${mode === 'CLONE' ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-200' : 'border-amber-100 text-amber-600 hover:bg-amber-50'}`}>
            <Copy size={18} className="inline mr-1"/> {mode === 'CLONE' ? 'Xem danh sách hiện tại' : 'Sao chép từ kho lẻ'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {mode === 'LIST' ? (
            <div className="space-y-3">
              {members.map(m => (
                <div key={m.id} className="flex items-center gap-4 p-4 border border-gray-100 rounded-2xl bg-white shadow-sm">
                   <img src={m.imageUrl} className="w-12 h-12 rounded-xl object-cover border" />
                   <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-text-primary truncate">{m.name}</p>
                      <PriceTag price={m.price} size="sm" />
                   </div>
                </div>
              ))}
              {members.length === 0 && <div className="text-center py-20 text-text-muted italic text-sm">Combo này chưa có dịch vụ nào.</div>}
            </div>
          ) : (
            <div className="space-y-3">
              {library.map(s => (
                <div key={s.id} className="flex justify-between items-center p-4 bg-amber-50/50 border border-amber-100 rounded-2xl group hover:bg-amber-50 transition-all">
                  <div>
                    <p className="font-bold text-sm text-text-primary">{s.name}</p>
                    <PriceTag price={s.price} size="sm" />
                  </div>
                  <button onClick={() => handleClone(s.id)} className="bg-white text-amber-600 px-4 py-2 rounded-xl text-xs font-black shadow-sm border border-amber-200 hover:bg-amber-600 hover:text-white transition-all uppercase">
                    Sao chép <ArrowRight size={14} className="inline ml-1"/>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ComboMemberManager;