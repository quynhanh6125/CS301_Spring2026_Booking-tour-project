import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="relative h-[520px] flex items-center justify-center overflow-hidden">
      {/* Background image */}
      <img
        src="https://res.cloudinary.com/dcrq2xo0b/image/upload/v1776603353/photo-1528127269322-539801943592_mr67qk.avif"
        className="absolute inset-0 w-full h-full object-cover"
        alt="Ha Long Bay"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-20 right-[15%] bg-white/10 backdrop-blur-sm rounded-2xl p-3 hidden lg:block"
      >
        <Sparkles className="text-yellow-300" size={24} />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="text-primary font-semibold text-sm mb-3 tracking-wider uppercase">
            🌏 Trải nghiệm không giới hạn
          </p>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-5 leading-tight drop-shadow-lg">
            Khám phá kỳ quan cùng{' '}
            <span className="text-gradient">Tâm Anh Travel</span>
          </h1>
          <p className="text-lg text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
            Đặt tour, khách sạn và hoạt động trải nghiệm tại Hạ Long với giá ưu đãi nhất.
          </p>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <form
            onSubmit={handleSearch}
            className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-2xl mx-auto"
          >
            <div className="flex-1 flex items-center px-4 rounded-xl bg-gray-50">
              <MapPin className="text-primary mr-2 flex-shrink-0" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Bạn muốn đi đâu? Tìm tour, hoạt động..."
                className="w-full py-3 bg-transparent focus:outline-none text-gray-700 placeholder-gray-400 text-sm"
              />
            </div>
            <button
              type="submit"
              className="gradient-primary text-white px-8 py-3.5 rounded-xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Search size={18} />
              <span>Tìm kiếm</span>
            </button>
          </form>

          {/* Quick tags */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {['Vịnh Hạ Long', 'Du thuyền', 'Đảo Cát Bà', 'Hang Sửng Sốt'].map((tag) => (
              <button
                key={tag}
                onClick={() => { setQuery(tag); navigate(`/search?q=${encodeURIComponent(tag)}`); }}
                className="bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full hover:bg-white/25 transition-colors border border-white/20"
              >
                {tag}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
