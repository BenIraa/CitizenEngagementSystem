
import React from 'react';
import { Complaint } from '@/lib/types';

interface PriorityBadgeProps {
  priority: Complaint['priority'];
  size?: 'sm' | 'md' | 'lg';
}

const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority, size = 'md' }) => {
  const getPriorityClasses = () => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium';
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
      lg: 'px-3 py-1 text-sm'
    };
    
    let colorClasses = '';
    
    switch (priority) {
      case 'low':
        colorClasses = 'bg-gray-100 text-gray-800';
        break;
      case 'medium':
        colorClasses = 'bg-blue-100 text-blue-800';
        break;
      case 'high':
        colorClasses = 'bg-orange-100 text-orange-800';
        break;
      case 'urgent':
        colorClasses = 'bg-red-100 text-red-800';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-800';
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${colorClasses}`;
  };
  
  return (
    <span className={getPriorityClasses()}>
      {priority.charAt(0).toUpperCase() + priority.slice(1)}
    </span>
  );
};

export default PriorityBadge;
