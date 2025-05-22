import { User, Complaint, Comment, Agency, ComplaintFilters } from './types';

// API configuration
const API_URL = '/api';

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Something went wrong');
  }
  // Check for empty response body before parsing JSON
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// Helper function to get token from localStorage
const getToken = (): string => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No token found');
  }
  return token;
};

// Auth functions
export const register = async (data: { email: string; password: string; name: string; role: string; agency_id?: number }): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
};

export const getProfile = async (token: string): Promise<User> => {
  const response = await fetch(`${API_URL}/users/profile`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const getUsers = async (): Promise<User[]> => {
  const response = await fetch(`${API_URL}/users`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
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

export const getComplaints = async (filters: ComplaintFilters = {}) => {
  try {
    const queryParams = new URLSearchParams();

    // Add filters to query params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        // Handle array values by joining them with commas
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, value.toString());
        }
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

export const getComplaintById = async (id: number) => {
  const response = await fetch(`${API_URL}/complaints/${id}`);
  return handleResponse(response);
};

export const updateComplaintStatus = async (token: string, id: number, status: Complaint['status']) => {
  const response = await fetch(`${API_URL}/complaints/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ status }),
  });
  return handleResponse(response);
};

// New function to update complaint priority
export const updateComplaintPriority = async (token: string, id: number, priority: Complaint['priority']) => {
  const response = await fetch(`${API_URL}/complaints/${id}/priority`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ priority }),
  });
  return handleResponse(response);
};

// New function to assign complaint to an agency
export const assignComplaint = async (token: string, id: number, agencyId: number | null) => {
  const response = await fetch(`${API_URL}/complaints/${id}/assign`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ agency_id: agencyId }),
  });
  return handleResponse(response);
};

// New function to delete a complaint
export const deleteComplaint = async (token: string, id: number) => {
  const response = await fetch(`${API_URL}/complaints/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  return handleResponse(response);
};

export const addResponse = async (token: string, complaintId: number, message: string) => {
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

export const getResponses = async (complaintId: number) => {
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

// Agency functions
export const getAgencies = async (): Promise<Agency[]> => {
  const response = await fetch(`${API_URL}/agencies`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

// New function to create an agency
export const createAgency = async (token: string, data: { name: string; department: string; userId?: string }) => {
  const response = await fetch(`${API_URL}/agencies`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const updateUser = async (id: number, data: { name: string; role: string; agency_id?: number }): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
  return handleResponse(response);
};

export const deleteUser = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
};

export const getUser = async (id: number): Promise<User> => {
  const response = await fetch(`${API_URL}/users/${id}`, {
    headers: {
      'Authorization': `Bearer ${getToken()}`,
    },
  });
  return handleResponse(response);
}; 