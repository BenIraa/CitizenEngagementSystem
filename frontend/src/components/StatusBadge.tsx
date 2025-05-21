
import React from 'react';
import { Complaint } from '@/lib/types';

interface StatusBadgeProps {
  status: Complaint['status'];
  size?: 'sm' | 'md' | 'lg';
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getStatusClasses = () => {
    const baseClasses = 'inline-flex items-center rounded-full font-medium';
    const sizeClasses = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
      lg: 'px-3 py-1 text-sm'
    };
    
    let colorClasses = '';
    
    switch (status) {
      case 'new':
        colorClasses = 'bg-blue-100 text-blue-800';
        break;
      case 'assigned':
        colorClasses = 'bg-purple-100 text-purple-800';
        break;
      case 'in-progress':
        colorClasses = 'bg-yellow-100 text-yellow-800';
        break;
      case 'resolved':
        colorClasses = 'bg-green-100 text-green-800';
        break;
      case 'closed':
        colorClasses = 'bg-gray-100 text-gray-800';
        break;
      default:
        colorClasses = 'bg-gray-100 text-gray-800';
    }
    
    return `${baseClasses} ${sizeClasses[size]} ${colorClasses}`;
  };
  
  const getStatusLabel = () => {
    switch (status) {
      case 'in-progress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };
  
  return (
    <span className={getStatusClasses()}>
      {getStatusLabel()}
    </span>
  );
};

export default StatusBadge;
