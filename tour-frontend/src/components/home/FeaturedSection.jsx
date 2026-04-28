import React from 'react';
import { Shield, Zap, BadgePercent, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const TRUST_ITEMS = [
  {
    icon: Zap,
    title: 'Xác nhận tức thì',
    desc: 'Nhận vé điện tử ngay sau khi đặt',
    color: 'text-amber-500',
    bg: 'bg-amber-50',
  },
  {
    icon: Shield,
    title: 'Miễn phí hủy',
    desc: 'Hủy miễn phí trước 24 giờ',
    color: 'text-emerald-500',
    bg: 'bg-emerald-50',
  },
  {
    icon: BadgePercent,
    title: 'Giá tốt nhất',
    desc: 'Cam kết giá ưu đãi hàng đầu',
    color: 'text-blue-500',
    bg: 'bg-blue-50',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ 24/7',
    desc: 'Đội ngũ hỗ trợ luôn sẵn sàng',
    color: 'text-purple-500',
    bg: 'bg-purple-50',
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const FeaturedSection = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {TRUST_ITEMS.map((t) => {
            const Icon = t.icon;
            return (
              <motion.div
                key={t.title}
                variants={item}
                className="flex items-start gap-4 p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-colors"
              >
                <div className={`w-12 h-12 ${t.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={t.color} size={22} />
                </div>
                <div>
                  <h4 className="font-bold text-text-primary text-sm mb-1">{t.title}</h4>
                  <p className="text-text-secondary text-xs leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedSection;
