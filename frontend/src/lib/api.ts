import { User } from './types';

const API_URL = 'http://localhost:3000/api';

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

// Complaint functions
export const createComplaint = async (token: string, data: { title: string; description: string; category: string }) => {
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

export const getComplaints = async (filters?: { status?: string; category?: string }) => {
  const queryParams = new URLSearchParams(filters).toString();
  const response = await fetch(`${API_URL}/complaints${queryParams ? `?${queryParams}` : ''}`);
  return handleResponse(response);
};

export const getComplaintById = async (id: string) => {
  const response = await fetch(`${API_URL}/complaints/${id}`);
  return handleResponse(response);
};

export const updateComplaintStatus = async (token: string, id: string, data: { status: string; assigned_to?: string }) => {
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