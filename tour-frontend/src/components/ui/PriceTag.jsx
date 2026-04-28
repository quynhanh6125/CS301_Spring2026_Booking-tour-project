import React from 'react';

const PriceTag = ({ price, originalPrice, size = 'md', className = '' }) => {
  const formatted = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price || 0);

  const formattedOriginal = originalPrice
    ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(originalPrice)
    : null;

  const sizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
    xl: 'text-3xl',
  };

  return (
    <div className={`flex items-baseline gap-2 ${className}`}>
      {formattedOriginal && (
        <span className="text-text-muted line-through text-sm">{formattedOriginal}</span>
      )}
      <span className={`font-black text-primary ${sizes[size]}`}>{formatted}</span>
    </div>
  );
};

export default PriceTag;
