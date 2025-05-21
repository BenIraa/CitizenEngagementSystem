
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { UserRound, LogOut, Shield } from 'lucide-react';

const AuthNav = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <>
          <div className="flex items-center gap-2">
            <UserRound className="h-4 w-4" />
            <span className="text-sm font-medium hidden md:inline-block">
              {user.name} 
              {user.role === 'admin' && (
                <span className="ml-1 text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">Admin</span>
              )}
              {user.role === 'super_admin' && (
                <span className="ml-1 text-xs bg-purple-600 text-white px-2 py-0.5 rounded-full">Super Admin</span>
              )}
              {user.role === 'agency' && (
                <span className="ml-1 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">Agency</span>
              )}
            </span>
          </div>
          {user.role === 'super_admin' && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/super-admin">
                <Shield className="mr-2 h-4 w-4" />
                Super Admin
              </Link>
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Sign In</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register">Register</Link>
          </Button>
        </>
      )}
    </div>
  );
};

export default AuthNav;
