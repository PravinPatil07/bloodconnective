
import { User, BloodRequest, Donation, BLOOD_GROUPS } from './types';
import { toast } from 'sonner';

// Local storage keys
const USERS_KEY = 'bloodconnect_users';
const CURRENT_USER_KEY = 'bloodconnect_current_user';
const REQUESTS_KEY = 'bloodconnect_requests';
const DONATIONS_KEY = 'bloodconnect_donations';

// Initial mock data for blood requests
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

// Initialize local storage with mock data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(REQUESTS_KEY)) {
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(initialRequests));
  }
  
  if (!localStorage.getItem(DONATIONS_KEY)) {
    localStorage.setItem(DONATIONS_KEY, JSON.stringify([]));
  }
};

// User management
export const getUsers = (): User[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
};

export const getCurrentUser = (): User | null => {
  const userId = localStorage.getItem(CURRENT_USER_KEY);
  if (!userId) return null;
  
  const users = getUsers();
  return users.find(user => user.id === userId) || null;
};

export const createUser = (userData: Omit<User, 'id' | 'isActive' | 'totalDonations'>): User => {
  const users = getUsers();
  
  // Generate a unique ID
  const id = Date.now().toString();
  
  const newUser: User = {
    id,
    ...userData,
    isActive: true,
    totalDonations: 0,
  };
  
  localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
  localStorage.setItem(CURRENT_USER_KEY, id);
  
  return newUser;
};

export const updateUser = (userId: string, userData: Partial<User>): User | null => {
  const users = getUsers();
  const userIndex = users.findIndex(user => user.id === userId);
  
  if (userIndex === -1) return null;
  
  const updatedUser = {
    ...users[userIndex],
    ...userData,
  };
  
  users[userIndex] = updatedUser;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  
  return updatedUser;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
  toast.success('Logged out successfully');
};

// Blood request management
export const getBloodRequests = (): BloodRequest[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(REQUESTS_KEY) || '[]');
};

export const createBloodRequest = (requestData: Omit<BloodRequest, 'id' | 'status' | 'postedAt'>): BloodRequest => {
  const requests = getBloodRequests();
  
  const newRequest: BloodRequest = {
    id: Date.now().toString(),
    ...requestData,
    status: 'open',
    postedAt: new Date().toISOString(),
  };
  
  localStorage.setItem(REQUESTS_KEY, JSON.stringify([...requests, newRequest]));
  toast.success('Blood request created successfully');
  
  return newRequest;
};

export const updateBloodRequest = (requestId: string, requestData: Partial<BloodRequest>): BloodRequest | null => {
  const requests = getBloodRequests();
  const requestIndex = requests.findIndex(req => req.id === requestId);
  
  if (requestIndex === -1) return null;
  
  const updatedRequest = {
    ...requests[requestIndex],
    ...requestData,
  };
  
  requests[requestIndex] = updatedRequest;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  
  return updatedRequest;
};

// Donation management
export const getDonations = (): Donation[] => {
  initializeStorage();
  return JSON.parse(localStorage.getItem(DONATIONS_KEY) || '[]');
};

export const createDonation = (donorId: string, requestId: string): Donation => {
  const donations = getDonations();
  const users = getUsers();
  const requests = getBloodRequests();
  
  // Create donation record
  const newDonation: Donation = {
    id: Date.now().toString(),
    donorId,
    requestId,
    donationDate: new Date().toISOString(),
  };
  
  // Update user's donation count and last donation date
  const userIndex = users.findIndex(user => user.id === donorId);
  if (userIndex !== -1) {
    users[userIndex] = {
      ...users[userIndex],
      lastDonation: newDonation.donationDate,
      totalDonations: (users[userIndex].totalDonations || 0) + 1,
    };
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  
  // Update request status
  const requestIndex = requests.findIndex(req => req.id === requestId);
  if (requestIndex !== -1) {
    requests[requestIndex] = {
      ...requests[requestIndex],
      status: 'fulfilled',
    };
    localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
  }
  
  // Save donation
  localStorage.setItem(DONATIONS_KEY, JSON.stringify([...donations, newDonation]));
  
  return newDonation;
};

export const getUserDonations = (userId: string): Donation[] => {
  const donations = getDonations();
  return donations.filter(donation => donation.donorId === userId);
};
