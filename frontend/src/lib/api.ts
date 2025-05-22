import { User, Complaint, Comment } from './types';

// API configuration
const API_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  return response.json();
};

// Auth functions
export const register = async (email: string, password: string, name: string, role: string) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, name, role }),
  });
  return handleResponse(response);
};

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const getProfile = async (token: string) => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUsers = async (token: string) => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
   return handleResponse(response);
};

// Complaint functions
export const createComplaint = async (token: string, data: { 
  title: string; 
  description: string; 
  category: string;
  location: string;
  priority: string;
}) => {
  const response = await fetch(`${API_URL}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const getComplaints = async (filters: any = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    // For admin view, don't include user_id filter unless explicitly provided
    const url = `${API_URL}/complaints?${queryParams.toString()}`;

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || errorData.error || 'Failed to fetch complaints');
    }

    const data = await response.json();
    console.log('Received complaints:', data);
    return data;
  } catch (error) {
    console.error('Error fetching complaints:', error);
    throw error;
  }
};

export const getComplaintById = async (id: string) => {
  const response = await fetch(`${API_URL}/complaints/${id}`);
  return handleResponse(response);
};

export const updateComplaintStatus = async (token: string, id: string, data: { status?: string; assigned_to?: string }) => {
  const response = await fetch(`${API_URL}/complaints/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const addResponse = async (token: string, complaintId: string, message: string) => {
  const response = await fetch(`${API_URL}/complaints/${complaintId}/responses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ message }),
  });
  return handleResponse(response);
};

export const getResponses = async (complaintId: string) => {
  const response = await fetch(`${API_URL}/complaints/${complaintId}/responses`);
  return handleResponse(response);
};

// Categories functions
export const getCategories = async () => {
  // For now, hardcode categories or fetch from a simple backend endpoint if created
  // In a real app, this would be fetched from the backend database
   const categories = [
    'Water Supply',
    'Street Lights',
    'Roads',
    'Waste Management',
    'Noise',
    'Public Parks',
    'Transportation',
    'Other'
  ];
  return Promise.resolve(categories);
}; 