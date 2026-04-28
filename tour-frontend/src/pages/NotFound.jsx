import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-custom-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <MapPin className="text-primary" size={40} />
        </motion.div>
        <h1 className="text-6xl font-black text-text-primary mb-4">404</h1>
        <p className="text-xl text-text-secondary mb-8">Trang bạn tìm kiếm không tồn tại</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 gradient-primary text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all shadow-md"
        >
          <Home size={20} />
          Về trang chủ
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFound;
