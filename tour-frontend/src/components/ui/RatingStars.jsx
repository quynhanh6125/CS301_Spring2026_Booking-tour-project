import React from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, count, size = 'sm', showValue = true }) => {
  const sizes = { xs: 12, sm: 14, md: 18, lg: 22 };
  const iconSize = sizes[size] || 14;
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      <div className="flex">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <Star key={`full-${i}`} size={iconSize} className="fill-amber-400 text-amber-400" />
        ))}
        {/* Half star */}
        {hasHalf && (
          <div className="relative" style={{ width: iconSize, height: iconSize }}>
            <Star size={iconSize} className="absolute text-gray-200 fill-gray-200" />
            <div className="absolute overflow-hidden" style={{ width: iconSize / 2 }}>
              <Star size={iconSize} className="fill-amber-400 text-amber-400" />
            </div>
          </div>
        )}
        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <Star key={`empty-${i}`} size={iconSize} className="text-gray-200 fill-gray-200" />
        ))}
      </div>
      {showValue && rating > 0 && (
        <span className="font-bold text-text-primary text-sm ml-0.5">{rating.toFixed(1)}</span>
      )}
      {count !== undefined && (
        <span className="text-text-secondary text-xs">({count})</span>
      )}
    </div>
  );
};

export default RatingStars;
