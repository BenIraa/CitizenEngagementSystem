import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Layout from '@/components/Layout';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Complaint, User } from '@/lib/types';
import * as api from '@/lib/api';
import { useAuth } from '@/lib/auth-context';
import { toast } from 'sonner';
import { format } from 'date-fns';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return 'N/A';
  
  return format(date, 'MMM dd, yyyy');
};

const AdminDashboard: React.FC = () => {
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
        let data: Complaint[] = [];
        if (user.role === 'agency') {
          // Fetch complaints assigned to the agency user's agency
          if (user.agency_id) {
            console.log('Fetching complaints for agency_id:', user.agency_id);
            data = await api.getComplaints({ assignedAgencyId: user.agency_id });
          } else {
            // Agency user not linked to an agency, show no complaints
            console.log('Agency user not linked to an agency. Showing no complaints.');
            setComplaints([]);
            setLoadingComplaints(false);
            return;
          }
        } else if (user.role === 'admin' || user.role === 'super_admin') {
          // Fetch all complaints for admin view
          console.log('Fetching all complaints for admin/superadmin.');
          data = await api.getComplaints({});
        }

        console.log('Complaints data received:', data);
        setComplaints(data);
      } catch (err: any) {
        setErrorComplaints('Failed to load complaints');
        toast.error(err.message || 'Failed to load complaints for dashboard');
        setComplaints([]); // Clear complaints on error
      } finally {
        setLoadingComplaints(false);
      }
    };
    // Fetch complaints when component mounts or user changes
    fetchComplaints();
  }, [user]);

  // --- Overview Calculations ---
  const newComplaintsCount = complaints.filter(c => c.status === 'new').length;
  const resolvedComplaintsCount = complaints.filter(c => c.status === 'resolved' || c.status === 'closed').length;
  const totalComplaintsCount = complaints.length;

  // Simple Status Distribution Data
  const complaintsByStatus = [
    { name: 'New', value: complaints.filter((c) => c.status === 'new').length },
    { name: 'Assigned', value: complaints.filter((c) => c.status === 'assigned').length },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'in-progress').length },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length },
    { name: 'Closed', value: complaints.filter((c) => c.status === 'closed').length },
  ];

  // Simple Category Distribution Data
  const complaintsByCategory = Object.entries(
    complaints.reduce<Record<string, number>>((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));
  // Sort categories by count descending
  complaintsByCategory.sort((a, b) => b.value - a.value);

   // Basic Trend Data (can be improved with date filtering)
   const trendData = complaints
     .reduce<Record<string, { new: number; resolved: number }>>((acc, complaint) => {
       const date = format(new Date(complaint.createdAt), 'yyyy-MM-dd');
       if (!acc[date]) {
         acc[date] = { new: 0, resolved: 0 };
       }
       if (complaint.status === 'new') {
         acc[date].new += 1;
       }
       if (complaint.status === 'resolved' || complaint.status === 'closed') {
         acc[date].resolved += 1;
       }
       return acc;
     }, {});
    
    const sortedTrendData = Object.entries(trendData)
      .map(([date, counts]) => ({ name: format(new Date(date), 'MMM dd'), ...counts }))
      .sort((a, b) => new Date(a.name).getTime() - new Date(b.name).getTime());

   // Basic Average Response Time (requires more complex calculation based on timestamps)
   // This is a placeholder and needs proper implementation
   const averageResponseTime = "N/A"; // Placeholder

   // Basic Citizen Satisfaction (requires feedback mechanism)
   // This is a placeholder and needs proper implementation
   const citizenSatisfaction = "N/A"; // Placeholder

  // Colors for pie charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#A28DFF', '#FF66C4', '#66FFB5'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-500">New Complaints</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{newComplaintsCount}</div>
             </CardContent>
           </Card>
            <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-500">Resolved Cases</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{resolvedComplaintsCount}</div>
             </CardContent>
           </Card>
            <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-500">Total Complaints</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{totalComplaintsCount}</div>
             </CardContent>
           </Card>
          {/* Placeholder cards for now */}
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-500">Average Response Time</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{averageResponseTime}</div>
             </CardContent>
           </Card>
           <Card>
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-medium text-gray-500">Citizen Satisfaction</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="text-2xl font-bold">{citizenSatisfaction}</div>
             </CardContent>
           </Card>
        </div>

         {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Complaint Trend Chart */}
          <Card>
            <CardHeader>
               <CardTitle className="text-lg">Complaint Trend</CardTitle>
               <CardDescription>New vs resolved complaints over time</CardDescription>
             </CardHeader>
             <CardContent>
              {loadingComplaints ? (
                <div className="flex justify-center items-center h-[300px]">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : errorComplaints ? (
                 <div className="text-center text-red-600 h-[300px] flex items-center justify-center">{errorComplaints}</div>
              ) : ( complaints.length > 0 ? (
               <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sortedTrendData}>
                       <XAxis dataKey="name" />
                       <YAxis />
                       <Tooltip />
                       <Line type="monotone" dataKey="new" stroke="#0056b3" strokeWidth={2} activeDot={{ r: 8 }} />
                       <Line type="monotone" dataKey="resolved" stroke="#28a745" strokeWidth={2} />
                     </LineChart>
                   </ResponsiveContainer>
                </div>
              ) : (<div className="text-center text-gray-600 h-[300px] flex items-center justify-center">No complaint data to show trend.</div>)
              )}
             </CardContent>
           </Card>

          {/* Status Distribution Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Distribution</CardTitle>
               <CardDescription>Current distribution of complaints by status</CardDescription>
             </CardHeader>
             <CardContent>
               {loadingComplaints ? (
                 <div className="flex justify-center items-center h-[300px]">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 </div>
              ) : errorComplaints ? (
                 <div className="text-center text-red-600 h-[300px] flex items-center justify-center">{errorComplaints}</div>
               ) : (complaintsByStatus.reduce((sum, current) => sum + current.value, 0) > 0 ? (
                <div className="h-[300px] w-full flex justify-center">
                  <ResponsiveContainer width="80%" height="100%">
                     <PieChart>
                       <Pie
                         data={complaintsByStatus}
                        cx="50%"
                         cy="50%"
                        labelLine={false}
                         label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                         outerRadius={80}
                        fill="#8884d8"
                       dataKey="value"
                       >
                         {complaintsByStatus.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                         ))}
                       </Pie>
                       <Tooltip />
                     </PieChart>
                   </ResponsiveContainer>
                </div>
               ) : (<div className="text-center text-gray-600 h-[300px] flex items-center justify-center">No complaint data to show status distribution.</div>) 
              )}
               <div className="flex justify-center flex-wrap gap-4 mt-4">
                 {complaintsByStatus.map((entry, index) => (
                   <div key={`legend-${index}`} className="flex items-center">
                    <div
                       className="w-3 h-3 mr-1"
                       style={{ backgroundColor: COLORS[index % COLORS.length] }}
                     />
                     <span className="text-xs">
                      {entry.name}: {entry.value}
                     </span>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           {/* Category Distribution List/Chart */}
            <Card className="lg:col-span-2">
             <CardHeader>
               <CardTitle className="text-lg">Category Distribution</CardTitle>
               <CardDescription>Types of complaints being submitted</CardDescription>
             </CardHeader>
             <CardContent>
               {loadingComplaints ? (
                 <div className="flex justify-center items-center h-[300px]">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                 </div>
              ) : errorComplaints ? (
                 <div className="text-center text-red-600 h-[300px] flex items-center justify-center">{errorComplaints}</div>
              ) : (complaintsByCategory.length > 0 ? (
               <div className="h-[300px] overflow-y-auto">
                 <div className="space-y-4">
                   {complaintsByCategory.map((item, index) => (
                     <div key={index}>
                       <div className="flex justify-between mb-1">
                         <span className="text-sm font-medium capitalize">{item.name}</span>
                         <span className="text-sm font-medium">{item.value}</span>
                       </div>
                       <div className="w-full bg-gray-200 rounded-full h-2.5">
                         <div
                          className="bg-blue-600 h-2.5 rounded-full"
                           style={{
                             width: `${(item.value / Math.max(1, ...complaintsByCategory.map(c => c.value))) * 100}%`,
                           }}
                         ></div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
              ) : (<div className="text-center text-gray-600 h-[300px] flex items-center justify-center">No complaint data to show category distribution.</div>)
              )}
             </CardContent>
           </Card>

        </div>

      </div>
    </Layout>
  );
};

export default AdminDashboard;
