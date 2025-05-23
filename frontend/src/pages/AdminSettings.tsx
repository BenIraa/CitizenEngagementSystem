import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Layout from '@/components/Layout';
import { User, Agency } from '@/lib/types';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AdminSettings: React.FC = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorUsers, setErrorUsers] = useState<string | null>(null);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [errorCategories, setErrorCategories] = useState<string | null>(null);
  const [loadingAgencies, setLoadingAgencies] = useState(true);
  const [errorAgencies, setErrorAgencies] = useState<string | null>(null);

  // State for new agency form
  const [newAgencyName, setNewAgencyName] = useState('');
  const [newAgencyDepartment, setNewAgencyDepartment] = useState('');
  const [selectedAgencyUser, setSelectedAgencyUser] = useState<string>('');
  const [isAddingAgency, setIsAddingAgency] = useState(false);

  // Get agency users (users with role 'agency' who aren't already linked to an agency)
  const agencyUsers = users.filter(u => 
    u.role === 'agency' && !u.agency_id
  );

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;
      setLoadingUsers(true);
      setErrorUsers(null);
      try {
        const data = await api.getUsers(user.token);
        setUsers(data);
      } catch (err) {
        setErrorUsers('Failed to load users');
        toast.error('Failed to load users');
      } finally {
        setLoadingUsers(false);
      }
    };
    fetchUsers();
  }, [user]);

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      setErrorCategories(null);
      try {
        const data = await api.getCategories();
        setCategories(data);
      } catch (err) {
        setErrorCategories('Failed to load categories');
        toast.error('Failed to load categories');
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  // Fetch Agencies
  const fetchAgencies = async () => {
    if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) return;
    setLoadingAgencies(true);
    setErrorAgencies(null);
    try {
      const data = await api.getAgencies(user.token);
      setAgencies(data);
    } catch (err) {
      setErrorAgencies('Failed to load agencies');
      toast.error('Failed to load agencies');
    } finally {
      setLoadingAgencies(false);
    }
  };

  useEffect(() => {
    fetchAgencies();
  }, [user]);

  // Handle Add Agency
  const handleAddAgency = async () => {
    if (!user) return;
    if (!newAgencyName.trim() || !newAgencyDepartment.trim()) {
      toast.error('Agency name and department cannot be empty');
      return;
    }

    setIsAddingAgency(true);
    try {
      const result = await api.createAgency(user.token, { 
        name: newAgencyName, 
        department: newAgencyDepartment,
        userId: selectedAgencyUser || undefined // Only include if a user is selected
      });
      
      toast.success('Agency added successfully!');
      setNewAgencyName('');
      setNewAgencyDepartment('');
      setSelectedAgencyUser('');
      fetchAgencies();
      // Refresh users to update agency_id for the linked user
      const data = await api.getUsers(user.token);
      setUsers(data);
    } catch (error: any) {
      console.error('Error adding agency:', error);
      toast.error(error.message || 'Failed to add agency');
    } finally {
      setIsAddingAgency(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start mb-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="agencies">Agencies</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="system-name">System Name</Label>
                    <Input id="system-name" defaultValue="CitizenEngagementSystem" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="contact-email">Contact Email</Label>
                    <Input id="contact-email" defaultValue="support@CitizenEngagementSystem.gov" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="default-language">Default Language</Label>
                    <select
                      id="default-language"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="auto-assign" />
                    <Label htmlFor="auto-assign">Auto-assign complaints to departments</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="public-comments" defaultChecked />
                    <Label htmlFor="public-comments">Allow public comments</Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Settings</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Display Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="items-per-page">Items Per Page</Label>
                    <Input id="items-per-page" type="number" defaultValue="20" className="mt-1" />
                  </div>
                  
                  <div>
                    <Label htmlFor="date-format">Date Format</Label>
                    <select
                      id="date-format"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="dark-mode" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch id="compact-view" />
                    <Label htmlFor="compact-view">Compact View</Label>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Display Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notification Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-new">New complaint notification</Label>
                      <Switch id="email-new" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-status">Status change notification</Label>
                      <Switch id="email-status" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-comment">New comment notification</Label>
                      <Switch id="email-comment" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-assignment">Assignment notification</Label>
                      <Switch id="email-assignment" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="email-digest">Daily digest</Label>
                      <Switch id="email-digest" />
                    </div>
                  </div>
                  
                  <div className="border-t pt-6">
                    <h3 className="font-medium mb-4">Automated Responses</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="auto-response">New Complaint Auto-Response</Label>
                        <textarea
                          id="auto-response"
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          defaultValue="Thank you for your complaint. Your reference number is #{{id}}. We are working on addressing your concerns."
                        ></textarea>
                      </div>
                      <div>
                        <Label htmlFor="resolved-response">Resolved Complaint Response</Label>
                        <textarea
                          id="resolved-response"
                          className="flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                          defaultValue="We're pleased to inform you that your complaint #{{id}} has been resolved. Please let us know if you have any further concerns."
                        ></textarea>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Notification Settings</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Manage Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-gray-500 text-sm mb-4">
                      Manage categories that citizens can use to classify their complaints
                    </p>
                    
                    {loadingCategories ? (
                       <div className="flex justify-center items-center p-8">
                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                       </div>
                    ) : errorCategories ? (
                       <div className="text-center text-red-600 p-8">{errorCategories}</div>
                    ) : (categories.length > 0 ? (
                     <div className="border rounded-md overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category Name</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {/* Render fetched categories - adapt this to use objects if categories become objects */}
                          {categories.map((category, index) => (
                            <TableRow key={index}>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{category}</TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">-</TableCell>{/* Placeholder */}
                              <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <Switch disabled />
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button variant="ghost" size="sm" disabled>Edit</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    ) : (<div className="text-center text-gray-600 p-8">No categories found.</div>)
                    )}
                    
                    <div className="flex justify-end">
                      <Button disabled={loadingCategories}>Add New Category</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-gray-500 text-sm mb-4">
                    Manage system users and their permissions
                  </p>
                  
                  {loadingUsers ? (
                     <div className="flex justify-center items-center p-8">
                       <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                     </div>
                  ) : errorUsers ? (
                     <div className="text-center text-red-600 p-8">{errorUsers}</div>
                  ) : (users.length > 0 ? (
                    <div className="border rounded-md overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Agency</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>{user.role}</TableCell>
                              <TableCell>{format(new Date(user.created_at), 'PPP p')}</TableCell>
                              <TableCell>
                                {user.role === 'agency' && user.agency_id ? (
                                  agencies.find(agency => agency.id === user.agency_id)?.name || 'N/A'
                                ) : (
                                  '-'
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <Button variant="ghost" size="sm">Edit</Button>
                                <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (<div className="text-center text-gray-600 p-8">No users found.</div>)
                  )}
                  
                  <div className="flex justify-end">
                     <Button disabled={loadingUsers}>Add New User</Button>
                   </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

           <TabsContent value="agencies">
             <Card>
               <CardHeader>
                 <CardTitle className="text-lg">Add New Agency</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div>
                   <Label htmlFor="agency-name">Agency Name</Label>
                   <Input
                     id="agency-name"
                     value={newAgencyName}
                     onChange={(e) => setNewAgencyName(e.target.value)}
                     className="mt-1"
                   />
                 </div>
                 <div>
                   <Label htmlFor="agency-department">Department</Label>
                   <Input
                     id="agency-department"
                     value={newAgencyDepartment}
                     onChange={(e) => setNewAgencyDepartment(e.target.value)}
                     className="mt-1"
                   />
                 </div>
                 <div>
                   <Label htmlFor="agency-user">Link to Agency User (Optional)</Label>
                   <Select onValueChange={setSelectedAgencyUser} value={selectedAgencyUser}>
                     <SelectTrigger className="w-full">
                       <SelectValue placeholder="Select an agency user" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="none-linked">Unlinked</SelectItem>
                       {agencyUsers.map(user => (
                         <SelectItem key={user.id} value={user.id.toString()}>{user.name} ({user.email})</SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                   <p className="text-sm text-gray-500 mt-1">Only unlinked users with the 'agency' role are shown.</p>
                 </div>
                 <div className="flex justify-end">
                   <Button onClick={handleAddAgency} disabled={isAddingAgency}>
                     {isAddingAgency ? 'Adding...' : 'Add Agency'}
                   </Button>
                 </div>
               </CardContent>
             </Card>

             <Card className="mt-6">
               <CardHeader>
                 <CardTitle className="text-lg">Existing Agencies</CardTitle>
                 <CardDescription>Manage existing agencies in the system.</CardDescription>
               </CardHeader>
               <CardContent>
                 {loadingAgencies ? (
                   <div>Loading agencies...</div>
                 ) : errorAgencies ? (
                   <div className="text-red-500">{errorAgencies}</div>
                 ) : agencies.length === 0 ? (
                   <div>No agencies found.</div>
                 ) : (
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>Name</TableHead>
                         <TableHead>Department</TableHead>
                         <TableHead>Created At</TableHead>
                         <TableHead>Linked User</TableHead>
                         <TableHead className="text-right">Actions</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {agencies.map((agency) => (
                         <TableRow key={agency.id}>
                           <TableCell className="font-medium">{agency.name}</TableCell>
                           <TableCell>{agency.department}</TableCell>
                           <TableCell>{agency.created_at ? format(new Date(agency.created_at), 'PPP p') : 'N/A'}</TableCell>
                           <TableCell>
                             {users.find(user => user.agency_id === agency.id)?.name || 'Unlinked'}
                           </TableCell>
                           <TableCell className="text-right">
                             <Button variant="ghost" size="sm">Edit</Button>
                             <Button variant="ghost" size="sm" className="text-red-600">Delete</Button>
                           </TableCell>
                         </TableRow>
                       ))}
                     </TableBody>
                   </Table>
                 )}
               </CardContent>
             </Card>
           </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminSettings;
