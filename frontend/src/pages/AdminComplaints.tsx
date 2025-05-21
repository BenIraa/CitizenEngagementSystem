import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import Layout from '@/components/Layout';
import ComplaintFilters from '@/components/ComplaintFilters';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import useStore from '@/lib/store';
import { ComplaintFilters as ComplaintFiltersType } from '@/lib/types';

const AdminComplaints: React.FC = () => {
  const navigate = useNavigate();
  const { getFilteredComplaints } = useStore();
  const [filters, setFilters] = useState<ComplaintFiltersType>({});

  // Get filtered complaints
  const filteredComplaints = getFilteredComplaints(filters);

  const handleApplyFilters = (newFilters: ComplaintFiltersType) => {
    setFilters(newFilters);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Manage Complaints</h1>
        <p className="text-gray-600 mb-6">
          Review, respond to, and manage citizen complaints
        </p>

        <ComplaintFilters onApplyFilters={handleApplyFilters} isAdminView />

        <Card>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComplaints.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                      No complaints found matching the current filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <TableRow 
                      key={complaint.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => navigate(`/admin/complaint/${complaint.id}`)}
                    >
                      <TableCell>#{complaint.id}</TableCell>
                      <TableCell className="font-medium">{complaint.title}</TableCell>
                      <TableCell className="capitalize">{complaint.category}</TableCell>
                      <TableCell>
                        <StatusBadge status={complaint.status} />
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={complaint.priority} />
                      </TableCell>
                      <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                      <TableCell>
                        {complaint.assignedAgencyName || '-'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminComplaints;
