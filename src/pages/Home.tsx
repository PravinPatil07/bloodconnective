
import React, { useState } from 'react';
import { getBloodRequests, getCurrentUser } from '@/lib/storage';
import { BloodRequest } from '@/lib/types';
import { AlertTriangle, Calendar, MapPin, Phone, Plus, User } from 'lucide-react';
import DonationModal from '@/components/DonationModal';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';

const Home = () => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  
  const currentUser = getCurrentUser();
  const bloodRequests = getBloodRequests().filter(req => req.status === 'open');
  
  const handleDonateClick = (request: BloodRequest) => {
    if (!currentUser) {
      toast.error('You must be logged in to donate blood');
      return;
    }
    
    setSelectedRequest(request);
    setShowDonationModal(true);
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blood/5 to-blood/20 pt-16 pb-24 px-4 md:px-8 md:ml-64">
      <div className="w-full max-w-3xl mx-auto">
        <div className="bg-blood text-white rounded-lg shadow-md p-6 mb-8 animate-fade-in">
          <h1 className="text-2xl font-bold">Welcome to BloodConnect</h1>
          <p className="mt-2 opacity-90">
            Find blood donation requests in your area and help save lives.
          </p>
        </div>
        
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">Blood Requests</h2>
          <button className="blood-btn-secondary flex items-center gap-2 text-sm">
            <Plus size={16} /> New Request
          </button>
        </div>
        
        <div className="space-y-4">
          {bloodRequests.length === 0 ? (
            <div className="blood-card bg-white p-8 text-center">
              <p className="text-gray-500">No blood requests available at the moment.</p>
            </div>
          ) : (
            bloodRequests.map(request => (
              <div 
                key={request.id} 
                className="blood-card border border-blood/10 animate-fade-in"
              >
                <div className="bg-blood/90 text-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                      <span className="text-blood font-bold text-sm">{request.bloodGroup}</span>
                    </div>
                    <h3 className="font-medium">Needs {request.bloodGroup} Blood Donor!</h3>
                  </div>
                  
                  {request.urgency === 'high' && (
                    <div className="flex items-center gap-1 bg-white/20 text-white text-xs px-2 py-1 rounded">
                      <AlertTriangle size={12} />
                      <span>Urgent</span>
                    </div>
                  )}
                </div>
                
                <div className="p-4 bg-white">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User size={16} className="text-blood/70" />
                      <span>Posted by: {request.postedBy}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone size={16} className="text-blood/70" />
                      <span>Contact: {request.contactNumber}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin size={16} className="text-blood/70" />
                      <span>From: {request.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-gray-700">
                      <Calendar size={16} className="text-blood/70" />
                      <span>Posted: {formatDistanceToNow(new Date(request.postedAt), { addSuffix: true })}</span>
                    </div>
                    
                    {request.message && (
                      <p className="text-gray-600 bg-gray-50 p-2 rounded text-sm">
                        {request.message}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <button 
                      className="blood-btn flex items-center gap-2"
                      onClick={() => handleDonateClick(request)}
                    >
                      Donate
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {showDonationModal && selectedRequest && (
        <DonationModal
          request={selectedRequest}
          onClose={() => {
            setShowDonationModal(false);
            setSelectedRequest(null);
          }}
        />
      )}
    </div>
  );
};

export default Home;
