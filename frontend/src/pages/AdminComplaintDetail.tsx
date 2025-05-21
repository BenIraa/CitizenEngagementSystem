
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
import useStore from '@/lib/store';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

const AdminComplaintDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getComplaintById, updateComplaintStatus, updateComplaintAgency } = useStore();
  const [complaint, setComplaint] = useState(
    id ? getComplaintById(id) : undefined
  );

  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedAgencyId, setSelectedAgencyId] = useState<string>('');

  useEffect(() => {
    if (id) {
      const complaintData = getComplaintById(id);
      if (complaintData) {
        setComplaint(complaintData);
        setSelectedStatus(complaintData.status);
        setSelectedAgencyId(complaintData.assignedAgencyId || '');
      } else {
        // Complaint not found, redirect to admin complaints page
        navigate('/admin/complaints');
      }
    }
  }, [id, getComplaintById, navigate]);

  const handleStatusChange = (newStatus: string) => {
    if (!id || !complaint) return;
    
    updateComplaintStatus(id, newStatus as any);
    setSelectedStatus(newStatus);
    toast.success(`Complaint status updated to ${newStatus}`);
    
    // Update the local state
    setComplaint({
      ...complaint,
      status: newStatus as any,
      updatedAt: new Date().toISOString()
    });
  };

  const handleAgencyChange = (agencyId: string) => {
    if (!id || !complaint) return;
    
    const agency = agencies.find(a => a.id === agencyId);
    if (agency) {
      updateComplaintAgency(id, agency.id, agency.name);
      setSelectedAgencyId(agency.id);
      toast.success(`Complaint assigned to ${agency.name}`);
      
      // Update the local state
      setComplaint({
        ...complaint,
        assignedAgencyId: agency.id,
        assignedAgencyName: agency.name,
        updatedAt: new Date().toISOString()
      });
    }
  };

  if (!complaint) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Loading complaint details...</p>
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
                  comments={complaint.comments}
                  isAdminView={true}
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
                        <SelectValue placeholder="Select agency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">-- Unassigned --</SelectItem>
                        {agencies.map((agency) => (
                          <SelectItem key={agency.id} value={agency.id}>
                            {agency.name} ({agency.department})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Management */}
                  <div>
                    <Label htmlFor="priority">Priority Level</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <PriorityBadge priority={complaint.priority} />
                      <Button variant="outline" size="sm">
                        Change
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Category Information</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="text-sm mb-4">
                  This complaint falls under the <span className="font-medium capitalize">{complaint.category}</span> category.
                </p>
                
                {complaint.assignedAgencyId && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <h4 className="font-medium mb-1">Assigned Department</h4>
                    <p className="text-sm">{complaint.assignedAgencyName}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {agencies.find(a => a.id === complaint.assignedAgencyId)?.department}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b bg-slate-50">
                <CardTitle className="text-lg">Additional Actions</CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    Send Email Notification
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Generate Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    View Audit Log
                  </Button>
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    Flag as Inappropriate
                  </Button>
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
