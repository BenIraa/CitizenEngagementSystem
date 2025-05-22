import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/lib/auth-context';
import { complaints } from '@/lib/data';
import StatusBadge from '@/components/StatusBadge';
import PriorityBadge from '@/components/PriorityBadge';

const AgencyDashboard: React.FC = () => {
  const { user } = useAuth();
  // Filter complaints assigned to this agency
  const agencyComplaints = complaints.filter(
    (c) => c.assignedAgencyId && user?.agencyId && c.assignedAgencyId === user.agencyId
  );

  // Stats
  const stats = [
    { label: 'Total Assigned', value: agencyComplaints.length },
    { label: 'In Progress', value: agencyComplaints.filter(c => c.status === 'in-progress').length },
    { label: 'Resolved', value: agencyComplaints.filter(c => c.status === 'resolved').length },
    { label: 'Closed', value: agencyComplaints.filter(c => c.status === 'closed').length },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-blue-800">Agency Dashboard</h1>
        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <Card key={idx}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Complaints Table */}
        <div className="bg-white rounded-md shadow overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencyComplaints.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                    No complaints assigned to your agency.
                  </TableCell>
                </TableRow>
              ) : (
                agencyComplaints.map((complaint) => (
                  <TableRow key={complaint.id}>
                    <TableCell>#{complaint.id}</TableCell>
                    <TableCell className="font-medium">{complaint.title}</TableCell>
                    <TableCell className="capitalize">{complaint.category}</TableCell>
                    <TableCell><StatusBadge status={complaint.status} /></TableCell>
                    <TableCell><PriorityBadge priority={complaint.priority} /></TableCell>
                    <TableCell>{new Date(complaint.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        {/* Placeholder for future API integration */}
        <div className="mt-8 text-sm text-gray-400">(Data shown is mock data. API integration coming soon.)</div>
      </div>
    </Layout>
  );
};

export default AgencyDashboard; 