import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Complaint, Agency } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return format(date, 'MMM dd, yyyy');
};

const statuses: Complaint['status'][] = ['new', 'assigned', 'in-progress', 'resolved', 'closed'];
const priorities: Complaint['priority'][] = ['low', 'medium', 'high', 'urgent'];

const AdminManageComplaintsPage: React.FC = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingComplaints, setLoadingComplaints] = useState(true);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [errorComplaints, setErrorComplaints] = useState<string | null>(null);
  const [errorAgencies, setErrorAgencies] = useState<string | null>(null);

  const fetchComplaints = async () => {
    if (!user) return;
    setLoadingComplaints(true);
    setErrorComplaints(null);
    try {
      const data: Complaint[] = await api.getComplaints({});
      setComplaints(data);
    } catch (err) {
      setErrorComplaints('Failed to load complaints');
      toast.error('Failed to load complaints');
    } finally {
      setLoadingComplaints(false);
    }
  };

  const fetchAgencies = async () => {
     if (!user) return;
     setLoadingAgencies(true);
     setErrorAgencies(null);
     try {
       const data: Agency[] = await api.getAgencies(user.token);
       setAgencies(data);
     } catch (err) {
       setErrorAgencies('Failed to load agencies');
       toast.error('Failed to load agencies');
     } finally {
       setLoadingAgencies(false);
     }
  };

  useEffect(() => {
    fetchComplaints();
    fetchAgencies();
  }, [user]);

  const handleStatusChange = async (complaintId: number, newStatus: Complaint['status']) => {
    if (!user) return;
    try {
      await api.updateComplaintStatus(user.token, complaintId, newStatus);
      toast.success('Complaint status updated');
      setComplaints(prevComplaints =>
        prevComplaints.map(c => (c.id === complaintId ? { ...c, status: newStatus } : c))
      );
    } catch (error) {
      toast.error('Failed to update complaint status');
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityChange = async (complaintId: number, newPriority: Complaint['priority']) => {
     if (!user) return;
     try {
       await api.updateComplaintPriority(user.token, complaintId, newPriority);
       toast.success('Complaint priority updated');
       setComplaints(prevComplaints =>
         prevComplaints.map(c => (c.id === complaintId ? { ...c, priority: newPriority } : c))
       );
     } catch (error) {
       toast.error('Failed to update complaint priority');
       console.error('Error updating priority:', error);
     }
  };

  const handleAssignChange = async (complaintId: number, newAgencyIdString: string) => {
     if (!user) return;
     const agencyId = newAgencyIdString === 'unassigned' ? null : parseInt(newAgencyIdString, 10);
     try {
       await api.assignComplaint(user.token, complaintId, agencyId);
       toast.success(agencyId === null ? 'Complaint unassigned' : 'Complaint assigned');
       setComplaints(prevComplaints =>
         prevComplaints.map(c =>
           c.id === complaintId
             ? { ...c, assignedTo: agencyId, assignedAgencyName: agencies.find(a => a.id === agencyId)?.name || null }
             : c
         )
       );
     } catch (error) {
       toast.error('Failed to assign complaint');
       console.error('Error assigning complaint:', error);
     }
  };

  const handleDeleteComplaint = async (complaintId: number) => {
     if (!user) return;
     try {
       await api.deleteComplaint(user.token, complaintId);
       toast.success('Complaint deleted');
       setComplaints(prevComplaints => prevComplaints.filter(c => c.id !== complaintId));
     } catch (error) {
       toast.error('Failed to delete complaint');
       console.error('Error deleting complaint:', error);
     }
  };

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
            {loadingComplaints || loadingAgencies ? (
              <div className="flex justify-center items-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : errorComplaints ? (
              <div className="text-center text-red-600 p-8">{errorComplaints}</div>
            ) : errorAgencies ? (
              <div className="text-center text-red-600 p-8">{errorAgencies}</div>
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
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complaints.map(complaint => (
                      <TableRow key={complaint.id}>
                        <TableCell className="font-medium"><Link to={`/admin/complaint/${complaint.id}`}>#{complaint.id}</Link></TableCell>
                        <TableCell>{complaint.title}</TableCell>
                        <TableCell className="capitalize">{complaint.category}</TableCell>
                        <TableCell>
                          <Select value={complaint.status} onValueChange={(value: Complaint['status']) => handleStatusChange(complaint.id, value)}>
                            <SelectTrigger className="w-[120px] capitalize">
                              <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statuses.map(status => (
                                <SelectItem key={status} value={status} className="capitalize">{status}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                           <Select value={complaint.priority} onValueChange={(value: Complaint['priority']) => handlePriorityChange(complaint.id, value)}>
                            <SelectTrigger className="w-[120px] capitalize">
                              <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              {priorities.map(priority => (
                                <SelectItem key={priority} value={priority} className="capitalize">{priority}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>{formatDate(complaint.createdAt)}</TableCell>
                        <TableCell>
                          <Select value={complaint.assignedTo?.toString() || 'unassigned'} onValueChange={(value) => handleAssignChange(complaint.id, value)}>
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Assign Agency" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="unassigned">Unassigned</SelectItem>
                              {agencies.map(agency => (
                                <SelectItem key={agency.id} value={agency.id.toString()}>{agency.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                         <TableCell>
                           <AlertDialog>
                             <AlertDialogTrigger asChild>
                               <Button variant="destructive" size="sm">Delete</Button>
                             </AlertDialogTrigger>
                             <AlertDialogContent>
                               <AlertDialogHeader>
                                 <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                 <AlertDialogDescription>
                                   This action cannot be undone. This will permanently delete the complaint and remove its data from our servers.
                                 </AlertDialogDescription>
                               </AlertDialogHeader>
                               <AlertDialogFooter>
                                 <AlertDialogCancel>Cancel</AlertDialogCancel>
                                 <AlertDialogAction onClick={() => handleDeleteComplaint(complaint.id)}>Delete</AlertDialogAction>
                               </AlertDialogFooter>
                             </AlertDialogContent>
                           </AlertDialog>
                         </TableCell>
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