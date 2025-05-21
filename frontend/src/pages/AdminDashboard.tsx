
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import { dashboardStats } from '@/lib/data';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import useStore from '@/lib/store';

const AdminDashboard: React.FC = () => {
  const { complaints } = useStore();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  
  // Count complaints by status
  const complaintsByStatus = [
    { name: 'New', value: complaints.filter((c) => c.status === 'new').length },
    { name: 'Assigned', value: complaints.filter((c) => c.status === 'assigned').length },
    { name: 'In Progress', value: complaints.filter((c) => c.status === 'in-progress').length },
    { name: 'Resolved', value: complaints.filter((c) => c.status === 'resolved').length },
    { name: 'Closed', value: complaints.filter((c) => c.status === 'closed').length },
  ];

  // Count complaints by category
  const complaintsByCategory = Object.entries(
    complaints.reduce<Record<string, number>>((acc, complaint) => {
      acc[complaint.category] = (acc[complaint.category] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  // Mock data for trend charts
  const trendData = [
    { name: 'Mon', new: 4, resolved: 2 },
    { name: 'Tue', new: 3, resolved: 3 },
    { name: 'Wed', new: 5, resolved: 4 },
    { name: 'Thu', new: 7, resolved: 3 },
    { name: 'Fri', new: 4, resolved: 5 },
    { name: 'Sat', new: 2, resolved: 4 },
    { name: 'Sun', new: 3, resolved: 2 },
  ];

  // Sample response time data
  const responseTimeData = [
    { name: 'Mon', time: 1.5 },
    { name: 'Tue', time: 1.8 },
    { name: 'Wed', time: 1.2 },
    { name: 'Thu', time: 2.3 },
    { name: 'Fri', time: 2.0 },
    { name: 'Sat', time: 0.8 },
    { name: 'Sun', time: 1.1 },
  ];

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {dashboardStats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {stat.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stat.label.includes('Time') ? `${stat.value} days` : 
                   stat.label.includes('Satisfaction') ? `${stat.value}%` : 
                   stat.value}
                </div>
                <p className={`text-xs ${stat.changePercent > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.changePercent > 0 ? '↑' : '↓'} {Math.abs(stat.changePercent)}% from last period
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Complaint Trend Chart */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Complaint Trend</CardTitle>
                <Tabs defaultValue="week" className="w-[200px]">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="week" onClick={() => setTimeRange('week')}>Week</TabsTrigger>
                    <TabsTrigger value="month" onClick={() => setTimeRange('month')}>Month</TabsTrigger>
                    <TabsTrigger value="year" onClick={() => setTimeRange('year')}>Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <CardDescription>New vs resolved complaints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="new" stroke="#0056b3" strokeWidth={2} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="resolved" stroke="#28a745" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Response Time Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Average Response Time</CardTitle>
              <CardDescription>Average time to first response in days</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={responseTimeData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="time" fill="#2d8cd1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status and Category Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Distribution</CardTitle>
              <CardDescription>Current distribution of complaints by status</CardDescription>
            </CardHeader>
            <CardContent>
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

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Category Distribution</CardTitle>
              <CardDescription>Types of complaints being submitted</CardDescription>
            </CardHeader>
            <CardContent>
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
                            width: `${(item.value / Math.max(...complaintsByCategory.map(c => c.value))) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
