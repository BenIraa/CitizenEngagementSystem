import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Complaint } from '@/lib/types';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import { Link } from 'react-router-dom';

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return format(date, 'MMM dd, yyyy');
};

const AdminManageComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [errorComplaints, setErrorComplaints] = useState<string | null>(null);

  // Fetch Complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      if (!user) return;
      setLoadingComplaints(true);
      setErrorComplaints(null);
      try {
        // Fetch all complaints for admin view
        const data = await api.getComplaints({}); 
        setComplaints(data);
      } catch (err) {
        setErrorComplaints('Failed to load complaints');
        toast.error('Failed to load complaints');
      } finally {
        setLoadingComplaints(false);
      }
    };
    // Fetch complaints when component mounts or user changes
    fetchComplaints();
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Complaints</h1>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Complaints</CardTitle>
            <CardDescription>View and manage all complaints submitted by citizens and agencies.</CardDescription>
          </CardHeader>
          <CardContent>
            {loadingComplaints ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : errorComplaints ? (
              <div className="text-center text-red-600 p-8">{errorComplaints}</div>
            ) : (complaints.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Assigned To</TableHead>
                      {/* Add more headers for actions if needed */}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map(complaint => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium"><Link to={`/admin/complaint/${complaint.id}`}>#{complaint.id}</Link></TableCell>
                        <TableCell>{complaint.title}</TableCell>
                        <TableCell className="capitalize">{complaint.category}</TableCell>
                        <TableCell><StatusBadge status={complaint.status} /></TableCell>
                        <TableCell><PriorityBadge priority={complaint.priority} /></TableCell>
                        <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                        <TableCell>{complaint.assignedAgencyName || '-'}</TableCell>
                        {/* Add more cells for actions if needed */}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (<div className="text-center text-gray-600 p-8">No complaints found.</div>)
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminManageComplaintsPage; 