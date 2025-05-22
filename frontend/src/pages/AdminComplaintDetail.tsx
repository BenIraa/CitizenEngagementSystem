import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import CommentsSection from '@/components/CommentsSection';
import { agencies } from '@/lib/data';
import { Complaint } from '@/lib/types';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';

const formatDate = (dateString: string): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short'
  }).format(date);
};

const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');

  // Fetch complaint details
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await api.getComplaintById(id);
        setComplaint(data);
        setSelectedStatus(data.status);
        setSelectedAgencyId(data.assignedAgencyId || '');
      } catch (err) {
        setError('Failed to load complaint details');
        toast.error('Failed to load complaint details');
        navigate('/admin/complaints');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  // Handle status update
  const handleStatusChange = async (newStatus: string) => {
    if (!id || !user) return;
    
    try {
      await api.updateComplaintStatus(user.token, id, { status: newStatus });
      setSelectedStatus(newStatus);
      // Optimistically update local state or refetch
      setComplaint(prev => prev ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() } : null);
      toast.success(`Complaint status updated to ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
      console.error(err);
    }
  };

  // Handle agency assignment update
  const handleAgencyChange = async (agencyId: string) => {
    if (!id || !user) return;
    
    try {
      await api.updateComplaintStatus(user.token, id, { assigned_to: agencyId });
      setSelectedAgencyId(agencyId);
       // Optimistically update local state or refetch
      const agency = agencies.find(a => a.id === agencyId);
      setComplaint(prev => prev ? { ...prev, assignedAgencyId: agencyId, assignedAgencyName: agency?.name, updatedAt: new Date().toISOString() } : null);
      toast.success(`Complaint assigned to ${agency?.name || 'Unknown Agency'}`);
    } catch (err) {
      toast.error('Failed to assign agency');
       console.error(err);
    }
  };

  // Handle adding comment/response
  const handleAddResponse = async (message: string) => {
    if (!id || !user) return;

    try {
      await api.addResponse(user.token, id, message);
      // Refetch complaint data to get updated comments/responses
      const updatedComplaint = await api.getComplaintById(id);
      setComplaint(updatedComplaint);
      toast.success('Response added successfully');
    } catch (err) {
      toast.error('Failed to add response');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading complaint details...</p>
        </div>
      </Layout>
    );
  }

  if (error || !complaint) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-red-600">{error || 'Complaint not found'}</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => navigate('/admin/complaints')}
          >
            Back to Complaints
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          size="sm"
          className="mb-4"
          onClick={() => navigate('/admin/complaints')}
        >
          ← Back to All Complaints
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main complaint details */}
          <div className="lg:col-span-2">
            <Card className="mb-6">
              <CardHeader className="border-b bg-slate-50">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-xl">{complaint.title}</CardTitle>
                  <StatusBadge status={complaint.status} size="lg" />
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Complaint ID</p>
                    <p className="font-medium">#{complaint.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Category</p>
                    <p className="font-medium capitalize">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Location</p>
                    <p className="font-medium">{complaint.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <PriorityBadge priority={complaint.priority} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Submitted On</p>
                    <p className="font-medium">{formatDate(complaint.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                    <p className="font-medium">{formatDate(complaint.updatedAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Citizen Name</p>
                    <p className="font-medium">{complaint.citizenName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Citizen Email</p>
                    <p className="font-medium">{complaint.citizenEmail}</p>
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {complaint.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <CommentsSection
                  complaintId={complaint.id}
                  comments={complaint.comments || []}
                  onAddComment={handleAddResponse}
                  // isAdminView is not needed here, CommentsSection handles user role internally
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar: Management Actions */}
          <div>
            <Card className="mb-6">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Manage Complaint</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {/* Status Update */}
                  <div>
                    <Label htmlFor="status">Update Status</Label>
                    <Select 
                      value={selectedStatus} 
                      onValueChange={handleStatusChange}
                    >
                      <SelectTrigger id="status" className="mt-1">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in-progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Agency Assignment */}
                  <div>
                    <Label htmlFor="agency">Assign to Agency</Label>
                     <Select 
                      value={selectedAgencyId} 
                      onValueChange={handleAgencyChange}
                     >
                      <SelectTrigger id="agency" className="mt-1">
                        <SelectValue placeholder="Assign to agency" />
                      </SelectTrigger>
                      <SelectContent>
                        {agencies.map(agency => (
                          <SelectItem key={agency.id} value={agency.id}>
                            {agency.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                     </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

             {/* Helpful Info */}
            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Helpful Info</CardTitle>
              </CardHeader>
               <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm">
                     Review the complaint details and timeline to determine the appropriate action.
                  </p>
                   <p className="text-sm">
                     Use the status update and agency assignment options to manage the complaint workflow.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AdminComplaintDetail;
