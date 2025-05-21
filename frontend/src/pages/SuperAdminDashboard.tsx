import React from 'react';
import Layout from '@/components/Layout';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Settings, Users, Building, Database } from 'lucide-react';
import { toast } from 'sonner';

const SuperAdminDashboard: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold text-purple-800">Super Admin Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Management Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="text-xl text-purple-800 flex items-center">
                <Users className="mr-2 h-5 w-5 text-purple-600" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage users and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                View all users, change roles, and manage user permissions across the platform.
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link to="/super-admin/users">
                  Manage Users
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Agency Management Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="text-xl text-purple-800 flex items-center">
                <Building className="mr-2 h-5 w-5 text-purple-600" />
                Agency Management
              </CardTitle>
              <CardDescription>
                Manage government agencies and their departments
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Add, edit, or remove agencies and assign categories for complaint routing.
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link to="/super-admin/agencies">
                  Manage Agencies
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Settings Card */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100 border-b">
              <CardTitle className="text-xl text-purple-800 flex items-center">
                <Settings className="mr-2 h-5 w-5 text-purple-600" />
                Platform Settings
              </CardTitle>
              <CardDescription>
                Configure system-wide settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-600 mb-6">
                Adjust platform configurations, manage integrations, and view analytics.
              </p>
              <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                <Link to="/super-admin/settings">
                  Go to Settings
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SuperAdminDashboard;
