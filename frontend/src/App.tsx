
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./lib/auth-context";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Citizen-facing pages
import Home from "./pages/Home";
import SubmitComplaint from "./pages/SubmitComplaint";
import TrackComplaints from "./pages/TrackComplaints";
import ComplaintDetail from "./pages/ComplaintDetail";

// Admin-facing pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminComplaints from "./pages/AdminComplaints";
import AdminComplaintDetail from "./pages/AdminComplaintDetail";
import AdminSettings from "./pages/AdminSettings";

// Super Admin pages
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminUserManagement from "./pages/SuperAdminUserManagement";
import SuperAdminAgencyManagement from "./pages/SuperAdminAgencyManagement";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route component for super admin routes
const SuperAdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user || user.role !== 'super_admin') {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route component for admin routes
const AdminRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user || (user.role !== 'admin' && user.role !== 'super_admin')) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Protected Route component for authenticated users
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Citizen Routes */}
            <Route path="/submit" element={
              <PrivateRoute>
                <SubmitComplaint />
              </PrivateRoute>
            } />
            <Route path="/track" element={
              <PrivateRoute>
                <TrackComplaints />
              </PrivateRoute>
            } />
            <Route path="/complaint/:id" element={
              <PrivateRoute>
                <ComplaintDetail />
              </PrivateRoute>
            } />
            
            {/* Protected Admin Routes */}
            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/complaints" element={
              <AdminRoute>
                <AdminComplaints />
              </AdminRoute>
            } />
            <Route path="/admin/complaint/:id" element={
              <AdminRoute>
                <AdminComplaintDetail />
              </AdminRoute>
            } />
            <Route path="/admin/settings" element={
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            } />
            
            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <SuperAdminRoute>
                <SuperAdminDashboard />
              </SuperAdminRoute>
            } />
            <Route path="/super-admin/users" element={
              <SuperAdminRoute>
                <SuperAdminUserManagement />
              </SuperAdminRoute>
            } />
            <Route path="/super-admin/agencies" element={
              <SuperAdminRoute>
                <SuperAdminAgencyManagement />
              </SuperAdminRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
