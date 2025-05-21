import React, { useEffect, useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Building, Plus } from 'lucide-react';

interface Agency {
  id: string;
  name: string;
  department: string;
  categories: string[];
  createdAt: string;
}

const SuperAdminAgencyManagement: React.FC = () => {
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newAgency, setNewAgency] = useState({
    name: '',
    department: '',
    categories: '',
  });
  
  // Fetch agencies on component mount
  useEffect(() => {
    fetchAgencies();
  }, []);
  
  // Dummy fetchAgencies
  const fetchAgencies = async () => {
    setLoading(true);
    toast.info('Agency loading is temporarily disabled.');
    setAgencies([]);
    setLoading(false);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAgency((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Dummy handleAddAgency
  const handleAddAgency = async () => {
    toast.info('Adding agency is temporarily disabled.');
    setIsAddDialogOpen(false);
    resetForm();
  };
  
  const resetForm = () => {
    setNewAgency({
      name: '',
      department: '',
      categories: '',
    });
  };
  
  const filteredAgencies = agencies.filter((agency) =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.department.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Agency Management</h1>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Agency
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add New Agency</DialogTitle>
                <DialogDescription>
                  Add a new government agency to the system. This agency will be able to receive and manage complaints.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <Label htmlFor="name">Agency Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newAgency.name}
                    onChange={handleInputChange}
                    placeholder="Enter agency name"
                  />
                </div>
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    name="department"
                    value={newAgency.department}
                    onChange={handleInputChange}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label htmlFor="categories">Categories (comma separated)</Label>
                  <Input
                    id="categories"
                    name="categories"
                    value={newAgency.categories}
                    onChange={handleInputChange}
                    placeholder="e.g. Water, Electricity, Roads"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddAgency} className="bg-purple-600 hover:bg-purple-700">
                  Add Agency
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <div className="bg-white p-4 rounded-md shadow mb-6">
          <div className="relative">
            <Input
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </div>
        {/* Agencies Table */}
        <div className="bg-white rounded-md shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-800"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgencies.length > 0 ? (
                  filteredAgencies.map((agency, index) => (
                    <TableRow key={agency.id}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell className="font-medium flex items-center">
                        <Building className="h-4 w-4 mr-2 text-gray-500" />
                        {agency.name}
                      </TableCell>
                      <TableCell>{agency.department}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {agency.categories?.map((category, i) => (
                            <span 
                              key={i} 
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full"
                            >
                              {category}
                            </span>
                          )) || 'None'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(agency.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No agencies found matching your criteria
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminAgencyManagement;
