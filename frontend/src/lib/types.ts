export interface Agency {
  id: number;
  name: string;
  department: string;
  categories: string[];
  created_at?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'citizen' | 'agency' | 'admin' | 'super_admin';
  agency_id?: number;
  created_at?: string;
  token?: string;
}

export interface Comment {
  id: number;
  complaintId: number;
  userId: string;
  userName: string;
  userRole: 'citizen' | 'agency' | 'admin' | 'super_admin';
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: 'new' | 'assigned' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
  citizenId: string;
  citizenName: string;
  citizenEmail: string;
  assignedTo: number | null;
  assignedAgencyName: string | null;
  attachments?: string[];
  comments?: Comment[];
}

export interface ComplaintFormData {
  title: string;
  description: string;
  category: string;
  location: string;
}

export interface DashboardStat {
  label: string;
  value: number;
  changePercent: number;
  description: string;
}

// Adding the ComplaintFilters interface to be used across the application
export interface ComplaintFilters {
  status?: ('new' | 'assigned' | 'in-progress' | 'resolved' | 'closed')[];
  category?: string[];
  priority?: ('low' | 'medium' | 'high' | 'urgent')[];
  searchTerm?: string;
  assignedAgencyId?: number | null;
  user_id?: number;
}
