import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'Không có dữ liệu',
  description = 'Chưa có nội dung nào để hiển thị.',
  action,
  actionLabel,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Icon className="w-10 h-10 text-text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
      <p className="text-text-secondary text-sm max-w-md mb-6">{description}</p>
      {action && (
        <button
          onClick={action}
          className="bg-primary text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-primary-dark transition-all shadow-sm"
        >
          {actionLabel || 'Thử lại'}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
