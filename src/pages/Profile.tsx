
import React, { useState } from 'react';
import { getCurrentUser, updateUser } from '@/lib/storage';
import { BLOOD_GROUPS } from '@/lib/types';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const user = getCurrentUser();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    gender: user?.gender || '',
    bloodGroup: user?.bloodGroup || '',
    contactNumber: user?.contactNumber || '',
    location: user?.location || '',
    division: user?.location?.split(', ')[1] || '',
    email: user?.email || '',
    isActive: user?.isActive || true,
  });
  
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blood/5">
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      updateUser(user.id, {
        name: formData.name,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        contactNumber: formData.contactNumber,
        location: `${formData.location}, ${formData.division}`,
        email: formData.email,
        isActive: formData.isActive,
      });
      
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Profile update error:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blood/5 to-blood/20 pt-16 pb-24 px-4 md:px-8 md:ml-64">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/" className="p-2 bg-white/80 rounded-full shadow-sm">
            <ArrowLeft size={18} className="text-blood" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Profile</h1>
        </div>
        
        <div className="blood-card bg-white p-6 animate-fade-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="blood-input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="blood-input w-full"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                Blood Group
              </label>
              <select
                id="bloodGroup"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                className="blood-input w-full"
              >
                <option value="">Select blood group</option>
                {BLOOD_GROUPS.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Contact Number
              </label>
              <input
                type="tel"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="blood-input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="blood-input w-full"
              />
            </div>
            
            <div>
              <label htmlFor="division" className="block text-sm font-medium text-gray-700 mb-1">
                Division
              </label>
              <select
                id="division"
                name="division"
                value={formData.division}
                onChange={handleChange}
                className="blood-input w-full"
              >
                <option value="">Select division</option>
                <option value="Dhaka">Dhaka</option>
                <option value="Chittagong">Chittagong</option>
                <option value="Khulna">Khulna</option>
                <option value="Rajshahi">Rajshahi</option>
                <option value="Barisal">Barisal</option>
                <option value="Sylhet">Sylhet</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="blood-input w-full"
              />
            </div>
            
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckboxChange}
                className="w-4 h-4 text-blood border-gray-300 rounded focus:ring-blood"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Available as donor
              </label>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                type="submit"
                className="blood-btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="loading-dots">Updating</span>
                ) : (
                  'Update Profile'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
