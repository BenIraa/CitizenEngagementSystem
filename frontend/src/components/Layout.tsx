
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import AuthNav from './AuthNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Check user roles
  const isAdmin = user && user.role === 'admin';
  const isSuperAdmin = user && user.role === 'super_admin';
  const isAgency = user && user.role === 'agency';
  
  const isAdminPath = location.pathname.startsWith('/admin');
  const isSuperAdminPath = location.pathname.startsWith('/super-admin');
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-gov-blue text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold">
            CitizenConnect
          </Link>
          
          <AuthNav />
        </div>
      </header>
      
      {/* Nav */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            {isSuperAdmin && isSuperAdminPath ? (
              // Super Admin Navigation
              <>
                <Link 
                  to="/super-admin"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/super-admin' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/super-admin/users"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/super-admin/users' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  User Management
                </Link>
                <Link 
                  to="/super-admin/agencies"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/super-admin/agencies' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'}`}
                >
                  Agency Management
                </Link>
                <Link 
                  to="/admin"
                  className={`px-4 py-3 font-medium text-sm text-gray-600 hover:text-purple-600`}
                >
                  Admin Panel
                </Link>
              </>
            ) : (isAdmin || isSuperAdmin) && isAdminPath ? (
              // Admin Navigation
              <>
                <Link 
                  to="/admin"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/admin' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/admin/complaints"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/admin/complaints' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Manage Complaints
                </Link>
                <Link 
                  to="/admin/settings"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/admin/settings' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Settings
                </Link>
                {isSuperAdmin && (
                  <Link 
                    to="/super-admin"
                    className="px-4 py-3 font-medium text-sm text-gray-600 hover:text-purple-600"
                  >
                    Super Admin
                  </Link>
                )}
              </>
            ) : (
              // Citizen Navigation
              <>
                <Link 
                  to="/"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Home
                </Link>
                <Link 
                  to="/submit"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/submit' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Submit Complaint
                </Link>
                <Link 
                  to="/track"
                  className={`px-4 py-3 font-medium text-sm ${location.pathname === '/track' ? 'text-gov-blue border-b-2 border-gov-blue' : 'text-gray-600 hover:text-gov-blue'}`}
                >
                  Track Complaints
                </Link>
                {(isAdmin || isSuperAdmin) && (
                  <Link 
                    to="/admin"
                    className="px-4 py-3 font-medium text-sm text-gray-600 hover:text-gov-blue"
                  >
                    Admin Dashboard
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </nav>
      
      {/* Main content */}
      <main className="flex-grow bg-gray-50">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">CitizenConnect</h3>
              <p className="text-sm">
                Bridging the gap between citizens and government agencies for effective public service feedback.
              </p>
            </div>
            
            <div>
              <h4 className="text-white text-md font-medium mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-white">Home</Link></li>
                <li><Link to="/submit" className="hover:text-white">Submit Complaint</Link></li>
                <li><Link to="/track" className="hover:text-white">Track Status</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQs</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white text-md font-medium mb-4">Contact</h4>
              <p className="text-sm mb-2">123 Government Plaza</p>
              <p className="text-sm mb-2">City Center, State 12345</p>
              <p className="text-sm">support@citizenconnect.gov</p>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-4 text-sm text-center">
            &copy; {new Date().getFullYear()} CitizenConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
