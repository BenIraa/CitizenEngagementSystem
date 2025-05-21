
import { Agency, Complaint, User, Comment, DashboardStat } from './types';

// Mock agencies
export const agencies: Agency[] = [
  {
    id: '1',
    name: 'Public Works Department',
    department: 'Infrastructure',
    categories: ['roads', 'bridges', 'public buildings', 'infrastructure']
  },
  {
    id: '2',
    name: 'Water and Sanitation',
    department: 'Utilities',
    categories: ['water supply', 'sewage', 'drainage', 'flooding']
  },
  {
    id: '3',
    name: 'Parks and Recreation',
    department: 'Public Spaces',
    categories: ['parks', 'playgrounds', 'public spaces', 'recreation']
  },
  {
    id: '4',
    name: 'Transportation Authority',
    department: 'Transportation',
    categories: ['public transport', 'traffic', 'parking', 'transportation']
  },
  {
    id: '5',
    name: 'Public Safety',
    department: 'Safety and Security',
    categories: ['safety', 'security', 'emergency services', 'public safety']
  },
];

// Sample users
export const users: User[] = [
  {
    id: '1',
    name: 'Jane Citizen',
    email: 'jane@example.com',
    role: 'citizen'
  },
  {
    id: '2',
    name: 'John Admin',
    email: 'john@govagency.com',
    role: 'agency',
    agencyId: '1'
  },
  {
    id: '3',
    name: 'Sarah Manager',
    email: 'sarah@govagency.com',
    role: 'admin'
  }
];

// Sample comments
export const comments: Comment[] = [
  {
    id: '1',
    complaintId: '1',
    userId: '2',
    userName: 'John Admin',
    userRole: 'agency',
    content: 'We have assigned a team to review this issue.',
    timestamp: '2025-05-18T10:30:00',
    isInternal: false
  },
  {
    id: '2',
    complaintId: '1',
    userId: '1',
    userName: 'Jane Citizen',
    userRole: 'citizen',
    content: 'Thank you for the quick response.',
    timestamp: '2025-05-18T11:15:00',
    isInternal: false
  },
  {
    id: '3',
    complaintId: '1',
    userId: '2',
    userName: 'John Admin',
    userRole: 'agency',
    content: 'Let\'s prioritize this for next week.',
    timestamp: '2025-05-18T13:45:00',
    isInternal: true
  }
];

// List of available categories
export const categories = [
  'roads',
  'bridges', 
  'public buildings',
  'infrastructure',
  'water supply',
  'sewage',
  'drainage',
  'flooding',
  'parks',
  'playgrounds',
  'public spaces',
  'recreation',
  'public transport',
  'traffic',
  'parking',
  'transportation',
  'safety',
  'security',
  'emergency services',
  'public safety',
  'other'
];

// Sample complaints
export const complaints: Complaint[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    description: 'Large pothole causing traffic hazard near 123 Main St intersection.',
    category: 'roads',
    location: '123 Main Street, Downtown',
    status: 'assigned',
    priority: 'medium',
    createdAt: '2025-05-15T09:30:00',
    updatedAt: '2025-05-16T14:20:00',
    citizenId: '1',
    citizenName: 'Jane Citizen',
    citizenEmail: 'jane@example.com',
    assignedAgencyId: '1',
    assignedAgencyName: 'Public Works Department',
    comments: comments.filter(c => c.complaintId === '1'),
  },
  {
    id: '2',
    title: 'Broken Streetlight',
    description: 'Streetlight not working for 3 days, creating unsafe conditions at night.',
    category: 'infrastructure',
    location: '456 Oak Avenue, Westside',
    status: 'new',
    priority: 'low',
    createdAt: '2025-05-17T16:45:00',
    updatedAt: '2025-05-17T16:45:00',
    citizenId: '1',
    citizenName: 'Jane Citizen',
    citizenEmail: 'jane@example.com',
  },
  {
    id: '3',
    title: 'Water Leakage',
    description: 'Water pipe leaking and causing road flooding.',
    category: 'water supply',
    location: '789 Pine Road, Eastside',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2025-05-14T08:15:00',
    updatedAt: '2025-05-17T11:30:00',
    citizenId: '1',
    citizenName: 'Jane Citizen',
    citizenEmail: 'jane@example.com',
    assignedAgencyId: '2',
    assignedAgencyName: 'Water and Sanitation',
  },
  {
    id: '4',
    title: 'Park Vandalism',
    description: 'Playground equipment damaged and graffiti on walls.',
    category: 'parks',
    location: 'Central City Park',
    status: 'resolved',
    priority: 'medium',
    createdAt: '2025-05-10T14:20:00',
    updatedAt: '2025-05-15T09:45:00',
    citizenId: '1',
    citizenName: 'Jane Citizen',
    citizenEmail: 'jane@example.com',
    assignedAgencyId: '3',
    assignedAgencyName: 'Parks and Recreation',
  },
  {
    id: '5',
    title: 'Bus Stop Missing Bench',
    description: 'The bench at the bus stop on Maple Street has been removed.',
    category: 'public transport',
    location: 'Maple Street Bus Stop',
    status: 'closed',
    priority: 'low',
    createdAt: '2025-05-05T10:10:00',
    updatedAt: '2025-05-12T16:30:00',
    citizenId: '1',
    citizenName: 'Jane Citizen',
    citizenEmail: 'jane@example.com',
    assignedAgencyId: '4',
    assignedAgencyName: 'Transportation Authority',
  },
];

// Sample dashboard statistics
export const dashboardStats: DashboardStat[] = [
  {
    label: 'New Complaints',
    value: 24,
    changePercent: 10,
    description: 'New complaints received this week'
  },
  {
    label: 'Resolved Cases',
    value: 18,
    changePercent: 5,
    description: 'Complaints resolved this week'
  },
  {
    label: 'Average Response Time',
    value: 2.5,
    changePercent: -15,
    description: 'Average days to first response'
  },
  {
    label: 'Citizen Satisfaction',
    value: 87,
    changePercent: 3,
    description: 'Percent satisfied with resolution'
  },
];
