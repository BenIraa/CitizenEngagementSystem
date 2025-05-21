import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ComplaintCard from '@/components/ComplaintCard';
import ComplaintFilters from '@/components/ComplaintFilters';
import useStore from '@/lib/store';
import { ComplaintFilters as ComplaintFiltersType } from '@/lib/types';

const TrackComplaints: React.FC = () => {
  const { complaints, getFilteredComplaints } = useStore();
  const [filters, setFilters] = useState<ComplaintFiltersType>({});

  // Apply filters to get filtered complaints
  const filteredComplaints = getFilteredComplaints(filters);

  const handleApplyFilters = (newFilters: ComplaintFiltersType) => {
    setFilters(newFilters);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Track Complaints</h1>
        <p className="text-gray-600 mb-6">
          Monitor the status and updates of your submitted complaints
        </p>

        <ComplaintFilters onApplyFilters={handleApplyFilters} />

        {filteredComplaints.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-600 mb-2">No complaints found</h3>
            <p className="text-gray-500">
              {Object.keys(filters).length > 0
                ? "Try adjusting your filters or search terms"
                : "You haven't submitted any complaints yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredComplaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackComplaints;
