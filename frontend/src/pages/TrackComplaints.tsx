import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ComplaintCard from '@/components/ComplaintCard';
import ComplaintFilters from '@/components/ComplaintFilters';
import { ComplaintFilters as ComplaintFiltersType, Complaint } from '@/lib/types';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

const TrackComplaints: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [filters, setFilters] = useState<ComplaintFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const apiFilters: ComplaintFiltersType = {
          ...filters,
        };

        if (user.role === 'citizen') {
          apiFilters.user_id = user.id;
        } else if (user.role === 'agency') {
          if (user.agency_id) {
            apiFilters.assignedAgencyId = user.agency_id;
          } else {
            setComplaints([]);
            setLoading(false);
            return;
          }
        }

        const data = await api.getComplaints(apiFilters);
        setComplaints(data);
      } catch (err: any) {
        setError('Failed to load complaints');
        toast.error(err.message || 'Failed to load complaints');
        setComplaints([]);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, [filters, user]);

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

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading complaints...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : complaints.length === 0 ? (
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
            {complaints.map((complaint) => (
              <ComplaintCard key={complaint.id} complaint={complaint} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TrackComplaints;
