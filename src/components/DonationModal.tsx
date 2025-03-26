
import React, { useState } from 'react';
import { createDonation, getCurrentUser } from '@/lib/storage';
import { BloodRequest } from '@/lib/types';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface DonationModalProps {
  request: BloodRequest;
  onClose: () => void;
}

const DonationModal: React.FC<DonationModalProps> = ({ request, onClose }) => {
  const currentUser = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  
  if (!currentUser) return null;
  
  const handleDonate = () => {
    setLoading(true);
    
    try {
      createDonation(currentUser.id, request.id);
      setConfirmed(true);
      toast.success('Blood donation recorded. Thank you for saving lives!');
    } catch (error) {
      console.error('Donation error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md animate-fade-in">
        <div className="bg-blood text-white px-6 py-4 rounded-t-lg flex items-center justify-between">
          <h3 className="font-semibold">{confirmed ? 'Donation Confirmed' : 'Confirm Blood Donation'}</h3>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6">
          {confirmed ? (
            <div className="text-center py-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Blood Donated</h3>
              <p className="text-gray-600 mb-6">
                Thank you for your donation! Your generosity will help save lives.
              </p>
              <button
                onClick={onClose}
                className="blood-btn w-full"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4">Donation Details</h4>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Blood Group:</span>
                    <span className="font-medium">{request.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="font-medium">{request.postedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{request.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Blood Group:</span>
                    <span className="font-medium">{currentUser.bloodGroup}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Your Name:</span>
                    <span className="font-medium">{currentUser.name}</span>
                  </div>
                </div>
                
                <div className="bg-amber-50 border-l-4 border-amber-400 p-4 text-sm text-amber-700">
                  <p className="font-medium">Important Notice</p>
                  <p>By confirming this donation, you are committing to donate blood as per the details above. Please ensure you are eligible to donate.</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="blood-btn-secondary flex-1"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonate}
                  className="blood-btn flex-1"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-dots">Processing</span>
                  ) : (
                    'Confirm Donation'
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
