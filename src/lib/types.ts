
export interface User {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  age: number;
  dateOfBirth: string;
  gender?: string;
  contactNumber?: string;
  email?: string;
  isActive: boolean;
  lastDonation?: string;
  totalDonations: number;
}

export interface BloodRequest {
  id: string;
  bloodGroup: string;
  postedBy: string;
  contactNumber: string;
  location: string;
  postedAt: string;
  urgency?: 'low' | 'medium' | 'high';
  status: 'open' | 'fulfilled' | 'closed';
  message?: string;
}

export interface Donation {
  id: string;
  donorId: string;
  requestId: string;
  donationDate: string;
}

export const BLOOD_GROUPS = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

export const calculateNextDonationDate = (lastDonationDate: string): number => {
  // 56 days (8 weeks) is the standard waiting period between blood donations
  const waitPeriod = 56;
  
  if (!lastDonationDate) return 0;
  
  const last = new Date(lastDonationDate);
  const nextDate = new Date(last);
  nextDate.setDate(last.getDate() + waitPeriod);
  
  const today = new Date();
  const diffTime = nextDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 ? diffDays : 0;
};
