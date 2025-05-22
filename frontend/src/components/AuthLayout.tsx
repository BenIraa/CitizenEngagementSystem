
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import AuthNav from './AuthNav';
import { Button } from './ui/button';

interface LayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  
  // Determine user role for navigation
  const isAdmin = user && user.role === 'admin';
  const isSuperAdmin = user && user.role === 'super_admin';
  const isAgency = user && user.role === 'agency';
  
  // Admin includes both regular admin and super admin
  const isAdminOrAgency = user && (isAdmin || isSuperAdmin || isAgency);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header/Navigation */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold text-gray-900">
            CitizenEngagementSystem
          </Link>
          
          <div className="flex items-center space-x-6">
            {user ? (
              <nav className="hidden md:flex items-center space-x-4">
                <Link to="/submit" className="text-gray-700 hover:text-gray-900">
                  Submit Complaint
                </Link>
                <Link to="/track" className="text-gray-700 hover:text-gray-900">
                  Track Complaints
                </Link>
                {isAdminOrAgency && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">
                      Admin Dashboard
                    </Link>
                  </Button>
                )}
                {isSuperAdmin && (
                  <Button variant="outline" className="bg-purple-50" asChild>
                    <Link to="/super-admin">
                      Super Admin
                    </Link>
                  </Button>
                )}
              </nav>
            ) : (
              <nav className="hidden md:flex items-center space-x-4">
                <Link to="/" className="text-gray-700 hover:text-gray-900">
                  Home
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-gray-900">
                  Login
                </Link>
                <Link to="/register" className="text-gray-700 hover:text-gray-900">
                  Register
                </Link>
              </nav>
            )}
            
            <AuthNav />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t py-6">
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} CitizenEngagementSystem. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
