import { User, BloodRequest, Donation, BLOOD_GROUPS } from './types';
import { toast } from 'sonner';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:5000/api';

// User management
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios.get(`${API_URL}/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem('CURRENT_USER_KEY');
  if (!userId) return null;
  
  // We still store the current user in localStorage for simplicity
  // but the actual data comes from MongoDB
  const userJson = localStorage.getItem(`USER_${userId}`);
  return userJson ? JSON.parse(userJson) : null;
};

export const createUser = async (userData: Omit<User, 'id' | 'isActive' | 'totalDonations'>): Promise<User> => {
  try {
    const response = await axios.post(`${API_URL}/users`, userData);
    const newUser = response.data;
    
    // Save to localStorage for current session
    localStorage.setItem('CURRENT_USER_KEY', newUser._id);
    localStorage.setItem(`USER_${newUser._id}`, JSON.stringify(newUser));
    
    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData);
    const updatedUser = response.data;
    
    // Update in localStorage
    localStorage.setItem(`USER_${userId}`, JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('CURRENT_USER_KEY');
  toast.success('Logged out successfully');
};

// Blood request management
export const getBloodRequests = async (): Promise<BloodRequest[]> => {
  try {
    const response = await axios.get(`${API_URL}/bloodRequests`);
    return response.data;
  } catch (error) {
    console.error("Error fetching blood requests:", error);
    return [];
  }
};

export const createBloodRequest = async (requestData: Omit<BloodRequest, 'id' | 'status' | 'postedAt'>): Promise<BloodRequest> => {
  try {
    const response = await axios.post(`${API_URL}/bloodRequests`, requestData);
    toast.success('Blood request created successfully');
    return response.data;
  } catch (error) {
    console.error("Error creating blood request:", error);
    throw error;
  }
};

export const updateBloodRequest = async (requestId: string, requestData: Partial<BloodRequest>): Promise<BloodRequest | null> => {
  try {
    const response = await axios.put(`${API_URL}/bloodRequests/${requestId}`, requestData);
    return response.data;
  } catch (error) {
    console.error("Error updating blood request:", error);
    return null;
  }
};

// Donation management
export const getDonations = async (): Promise<Donation[]> => {
  try {
    const response = await axios.get(`${API_URL}/donations`);
    return response.data;
  } catch (error) {
    console.error("Error fetching donations:", error);
    return [];
  }
};

export const createDonation = async (donorId: string, requestId: string): Promise<Donation> => {
  try {
    const response = await axios.post(`${API_URL}/donations`, { donorId, requestId });
    return response.data;
  } catch (error) {
    console.error("Error creating donation:", error);
    throw error;
  }
};

export const getUserDonations = async (userId: string): Promise<Donation[]> => {
  try {
    const response = await axios.get(`${API_URL}/donations/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user donations:", error);
    return [];
  }
};

// Initial mock data for blood requests (kept for reference)
const initialRequests: BloodRequest[] = [
  {
    id: '1',
    bloodGroup: 'B+',
    postedBy: 'Abdul Khalek',
    contactNumber: '01734206885',
    location: 'Gazipur, Dhaka',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'open',
  },
  {
    id: '2',
    bloodGroup: 'A+',
    postedBy: 'Raju',
    contactNumber: '01982872891',
    location: 'Dhanmondi, Dhaka',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    status: 'open',
  },
  {
    id: '3',
    bloodGroup: 'O-',
    postedBy: 'Anika',
    contactNumber: '01712345678',
    location: 'Uttara, Dhaka',
    postedAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    urgency: 'high',
    status: 'open',
    message: 'Urgently needed for accident victim',
  },
];
