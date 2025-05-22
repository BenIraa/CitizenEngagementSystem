import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';
import CommentsSection from '@/components/CommentsSection';
import { Complaint } from '@/lib/types';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';

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
  }).format(date);
};

const ComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await api.getComplaintById(id);
        setComplaint(data);
      } catch (err) {
        setError('Failed to load complaint details');
        toast.error('Failed to load complaint details');
        navigate('/track');
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id, navigate]);

  const handleAddResponse = async (message: string) => {
    if (!id || !user) return;

    try {
      await api.addResponse(user.token, id, message);
      // Refresh complaint data to get updated responses
      const updatedComplaint = await api.getComplaintById(id);
      setComplaint(updatedComplaint);
      toast.success('Response added successfully');
    } catch (err) {
      toast.error('Failed to add response');
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
            onClick={() => navigate('/track')}
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
          onClick={() => navigate('/track')}
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
                </div>

                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {complaint.description}
                  </p>
                </div>

                {complaint.assignedAgencyName && (
                  <div className="border-t pt-4 mt-4">
                    <h3 className="font-medium mb-2">Assigned Department</h3>
                    <p className="text-gray-700">{complaint.assignedAgencyName}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <CommentsSection
                  complaintId={complaint.id}
                  comments={complaint.comments || []}
                  onAddComment={handleAddResponse}
                />
              </CardContent>
            </Card>
          </div>

          {/* Status timeline and helpful info */}
          <div>
            <Card className="mb-6">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Status Timeline</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="relative pl-8 pb-8 before:absolute before:left-[7px] before:h-full before:w-0.5 before:bg-gray-200">
                  <div className="relative mb-6">
                    <div className="absolute left-[-25px] top-1 h-3 w-3 rounded-full border-2 border-gov-blue bg-white"></div>
                    <p className="font-medium">Submitted</p>
                    <p className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</p>
                  </div>

                  {complaint.status !== 'new' && (
                    <div className="relative mb-6">
                      <div className="absolute left-[-25px] top-1 h-3 w-3 rounded-full border-2 border-gov-blue bg-white"></div>
                      <p className="font-medium">Assigned to Department</p>
                      <p className="text-sm text-gray-500">{complaint.assignedAgencyName}</p>
                    </div>
                  )}

                  {['in-progress', 'resolved', 'closed'].includes(complaint.status) && (
                    <div className="relative mb-6">
                      <div className="absolute left-[-25px] top-1 h-3 w-3 rounded-full border-2 border-gov-blue bg-white"></div>
                      <p className="font-medium">In Progress</p>
                      <p className="text-sm text-gray-500">Investigation ongoing</p>
                    </div>
                  )}

                  {['resolved', 'closed'].includes(complaint.status) && (
                    <div className="relative mb-6">
                      <div className="absolute left-[-25px] top-1 h-3 w-3 rounded-full border-2 border-gov-blue bg-white"></div>
                      <p className="font-medium">Resolved</p>
                      <p className="text-sm text-gray-500">Issue has been addressed</p>
                    </div>
                  )}

                  {complaint.status === 'closed' && (
                    <div className="relative">
                      <div className="absolute left-[-25px] top-1 h-3 w-3 rounded-full border-2 border-gov-blue bg-white"></div>
                      <p className="font-medium">Closed</p>
                      <p className="text-sm text-gray-500">Case completed</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <p className="text-sm">
                    If you need further assistance with this complaint, please contact:
                  </p>
                  
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium mb-1">Citizen Support</h4>
                    <p className="text-sm">support@CitizenEngagementSystem.gov</p>
                    <p className="text-sm">1-800-555-HELP</p>
                  </div>

                  {complaint.assignedAgencyName && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <h4 className="font-medium mb-1">{complaint.assignedAgencyName}</h4>
                      <p className="text-sm">Contact the assigned department directly</p>
                      <Button variant="link" className="text-sm p-0 h-auto">
                        View Contact Information
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ComplaintDetail;
