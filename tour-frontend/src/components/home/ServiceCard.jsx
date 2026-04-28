import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import RatingStars from '../ui/RatingStars';
import PriceTag from '../ui/PriceTag';

const CATEGORY_LABELS = {
  HOTEL: 'Khách sạn',
  TRANSPORT: 'Di chuyển',
  TOUR: 'Tour',
  PHOTOGRAPHY: 'Chụp ảnh',
  FOOD: 'Ẩm thực',
  ENTERTAINMENT: 'Giải trí',
};

const ServiceCard = ({ service }) => {
  const fallbackImg = 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&q=80';

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link to={`/service/${service.id}`} className="block group">
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
          {/* Image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={service.imageUrl || fallbackImg}
              alt={service.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Category badge */}
            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-xs font-bold text-text-primary shadow-sm">
              {CATEGORY_LABELS[service.category] || service.category}
            </div>
            {/* Type badge for COMBO */}
            {service.type === 'COMBO' && (
              <div className="absolute top-3 right-3 gradient-primary px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-sm">
                COMBO
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-bold text-text-primary mb-1.5 truncate group-hover:text-primary transition-colors text-[15px]">
              {service.name}
            </h3>

            {/* Rating */}
            <div className="mb-3">
              <RatingStars
                rating={service.avgRating || 0}
                count={service.reviewCount || 0}
                size="xs"
              />
            </div>

            {/* Duration */}
            {service.duration && (
              <div className="flex items-center text-text-secondary text-xs mb-3">
                <Clock size={13} className="mr-1" />
                <span>{service.duration}</span>
              </div>
            )}

            {/* Price */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-50">
              <span className="text-xs text-text-muted">Từ</span>
              <PriceTag price={service.price} size="md" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ServiceCard;
