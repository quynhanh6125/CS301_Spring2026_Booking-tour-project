import React from 'react';
import { Hotel, Bus, Mountain, Camera, UtensilsCrossed, PartyPopper, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = [
  { key: null, label: 'Tất cả', icon: LayoutGrid },
  { key: 'TOUR', label: 'Tour', icon: Mountain },
  { key: 'HOTEL', label: 'Khách sạn', icon: Hotel },
  { key: 'TRANSPORT', label: 'Di chuyển', icon: Bus },
  { key: 'PHOTOGRAPHY', label: 'Chụp ảnh', icon: Camera },
  { key: 'FOOD', label: 'Ẩm thực', icon: UtensilsCrossed },
  { key: 'ENTERTAINMENT', label: 'Giải trí', icon: PartyPopper },
];

const CategoryBar = ({ selected, onSelect }) => {
  return (
    <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selected === cat.key;
            return (
              <motion.button
                key={cat.key || 'all'}
                onClick={() => onSelect(cat.key)}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0
                  ${isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-gray-50 text-text-secondary hover:bg-gray-100 hover:text-text-primary'
                  }`}
              >
                <Icon size={16} />
                <span>{cat.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
