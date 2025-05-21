
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Complaint } from '@/lib/types';
import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';

interface ComplaintCardProps {
  complaint: Complaint;
  isAdminView?: boolean;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

const ComplaintCard: React.FC<ComplaintCardProps> = ({ complaint, isAdminView = false }) => {
  const { id, title, category, location, status, priority, createdAt, assignedAgencyName } = complaint;
  
  return (
    <Link to={isAdminView ? `/admin/complaint/${id}` : `/complaint/${id}`}>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-base text-gray-900 mb-1">{title}</h3>
            <StatusBadge status={status} />
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            <span className="inline-block mr-2">
              <span className="font-medium">ID:</span> #{id}
            </span>
            <span className="inline-block">
              <span className="font-medium">Filed:</span> {formatDate(createdAt)}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-y-2 text-sm">
            <div className="w-full sm:w-1/2">
              <span className="font-medium text-gray-700">Category:</span>{' '}
              <span className="capitalize">{category}</span>
            </div>
            <div className="w-full sm:w-1/2">
              <span className="font-medium text-gray-700">Priority:</span>{' '}
              <PriorityBadge priority={priority} size="sm" />
            </div>
            <div className="w-full">
              <span className="font-medium text-gray-700">Location:</span>{' '}
              <span className="text-gray-600">{location}</span>
            </div>
            {assignedAgencyName && (
              <div className="w-full">
                <span className="font-medium text-gray-700">Assigned to:</span>{' '}
                <span className="text-gray-600">{assignedAgencyName}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ComplaintCard;
