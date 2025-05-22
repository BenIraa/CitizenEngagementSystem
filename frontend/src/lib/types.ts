export interface Agency {
  id: string;
  name: string;
  department: string;
  categories: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'agency' | 'admin' | 'super_admin';
  token: string;
  agencyId?: string;
}

export interface Comment {
  id: string;
  complaintId: string;
  userId: string;
  userName: string;
  userRole: 'citizen' | 'agency' | 'admin' | 'super_admin';
  content: string;
  timestamp: string;
  isInternal: boolean;
}

export interface Complaint {
  id: string;
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
  assignedAgencyId?: string;
  assignedAgencyName?: string;
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
  assignedAgencyId?: string;
}
