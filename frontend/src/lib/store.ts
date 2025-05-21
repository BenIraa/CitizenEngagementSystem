import { create } from 'zustand';
import { complaints as initialComplaints, users as initialUsers } from './data';
import { Complaint, User, ComplaintFormData, Comment, ComplaintFilters } from './types';

interface AppState {
  // Auth
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Complaints data
  complaints: Complaint[];
  addComplaint: (complaint: ComplaintFormData) => void;
  updateComplaintStatus: (id: string, status: Complaint['status']) => void;
  updateComplaintAgency: (id: string, agencyId: string, agencyName: string) => void;
  addComment: (complaintId: string, content: string, isInternal: boolean) => void;
  getComplaintById: (id: string) => Complaint | undefined;
  getFilteredComplaints: (filters: ComplaintFilters) => Complaint[];
  
  // UI state
  activeView: 'citizen' | 'admin';
  setActiveView: (view: 'citizen' | 'admin') => void;
}

const useStore = create<AppState>((set, get) => ({
  // Auth state with default user
  currentUser: {
    id: '1',
    name: 'Jane Citizen',
    email: 'jane@example.com',
    role: 'citizen'
  },
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Complaints data
  complaints: [...initialComplaints],
  
  // Add new complaint
  addComplaint: (complaintData) => set((state) => {
    const { currentUser } = state;
    if (!currentUser) return state;
    
    const newComplaint: Complaint = {
      id: `${state.complaints.length + 1}`,
      ...complaintData,
      status: 'new',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenId: currentUser.id,
      citizenName: currentUser.name,
      citizenEmail: currentUser.email,
      comments: [],
    };
    
    return {
      complaints: [...state.complaints, newComplaint]
    };
  }),
  
  // Update complaint status
  updateComplaintStatus: (id, status) => set((state) => ({
    complaints: state.complaints.map((complaint) =>
      complaint.id === id
        ? { ...complaint, status, updatedAt: new Date().toISOString() }
        : complaint
    )
  })),
  
  // Update assigned agency
  updateComplaintAgency: (id, agencyId, agencyName) => set((state) => ({
    complaints: state.complaints.map((complaint) =>
      complaint.id === id
        ? { 
            ...complaint, 
            assignedAgencyId: agencyId,
            assignedAgencyName: agencyName,
            status: complaint.status === 'new' ? 'assigned' : complaint.status,
            updatedAt: new Date().toISOString() 
          }
        : complaint
    )
  })),
  
  // Add comment to complaint
  addComment: (complaintId, content, isInternal) => set((state) => {
    const { currentUser } = state;
    if (!currentUser) return state;
    
    const newComment: Comment = {
      id: Math.random().toString(36).substring(2, 11),
      complaintId,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      content,
      timestamp: new Date().toISOString(),
      isInternal,
    };
    
    return {
      complaints: state.complaints.map((complaint) =>
        complaint.id === complaintId
          ? { 
              ...complaint, 
              comments: [...(complaint.comments || []), newComment],
              updatedAt: new Date().toISOString()
            }
          : complaint
      )
    };
  }),
  
  // Get complaint by ID
  getComplaintById: (id) => {
    const state = get();
    return state.complaints.find(complaint => complaint.id === id);
  },
  
  // Get filtered complaints
  getFilteredComplaints: (filters) => {
    const { complaints } = get();
    
    return complaints.filter(complaint => {
      // Filter by status if provided
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(complaint.status)) {
          return false;
        }
      }
      
      // Filter by category if provided
      if (filters.category && filters.category.length > 0) {
        if (!filters.category.includes(complaint.category)) {
          return false;
        }
      }
      
      // Filter by priority if provided
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(complaint.priority)) {
          return false;
        }
      }
      
      // Filter by agency if provided
      if (filters.assignedAgencyId && complaint.assignedAgencyId !== filters.assignedAgencyId) {
        return false;
      }
      
      // Search term (searches in title and description)
      if (filters.searchTerm && filters.searchTerm.trim() !== '') {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          complaint.title.toLowerCase().includes(searchLower) || 
          complaint.description.toLowerCase().includes(searchLower) ||
          complaint.location.toLowerCase().includes(searchLower);
          
        if (!matchesSearch) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  // UI state
  activeView: 'citizen',
  setActiveView: (view) => set({ activeView: view }),
}));

export default useStore;
