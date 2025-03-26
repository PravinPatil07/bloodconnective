
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, getCurrentUser } from '@/lib/storage';
import { BLOOD_GROUPS } from '@/lib/types';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    bloodGroup: '',
    location: '',
    age: '',
    dateOfBirth: '',
    contactNumber: '',
    email: '',
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (step === 1 && (!formData.name || !formData.bloodGroup || !formData.age)) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    if (step === 2 && (!formData.location || !formData.dateOfBirth)) {
      setError('Please fill in all required fields');
      return;
    }
    
    setLoading(true);
    
    try {
      const newUser = createUser({
        name: formData.name,
        bloodGroup: formData.bloodGroup,
        location: formData.location,
        age: parseInt(formData.age),
        dateOfBirth: formData.dateOfBirth,
        contactNumber: formData.contactNumber,
        email: formData.email,
      });
      
      toast.success('Registration successful!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      setError('An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blood/5 to-blood/20 px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="mb-4 bg-white rounded-full w-24 h-24 flex items-center justify-center mx-auto shadow-md p-5">
            <img 
              src="/lovable-uploads/6f89a060-0d9a-463a-9e6a-0f5798b6c66c.png" 
              alt="Blood Connect Logo" 
              className="w-16 h-16 object-contain" 
            />
          </div>
          <h1 className="text-3xl font-bold text-blood">BloodConnect</h1>
          <p className="text-gray-600 mt-2">Donate Blood, Save Lives</p>
        </div>
        
        <div className="bg-white backdrop-blur-sm rounded-xl shadow-lg border border-blood/10 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {step === 1 ? 'Create Your Account' : 'Complete Your Profile'}
            </h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="blood-input w-full"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-gray-700 mb-1">
                      Blood Group*
                    </label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="blood-input w-full"
                      required
                    >
                      <option value="">Select blood group</option>
                      {BLOOD_GROUPS.map(group => (
                        <option key={group} value={group}>{group}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                      Age*
                    </label>
                    <input
                      type="number"
                      id="age"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      className="blood-input w-full"
                      placeholder="Enter your age"
                      min="18"
                      max="65"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">You must be between 18-65 years old to donate blood</p>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                      Location*
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="blood-input w-full"
                      placeholder="City, Area"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Birth*
                    </label>
                    <input
                      type="date"
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="blood-input w-full"
                      required
                    />
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
                      placeholder="Enter your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="blood-input w-full"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-between">
                {step === 2 && (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="blood-btn-secondary"
                    disabled={loading}
                  >
                    Back
                  </button>
                )}
                <button
                  type="submit"
                  className={`blood-btn ${step === 1 ? 'ml-auto' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading-dots">Processing</span>
                  ) : step === 1 ? (
                    'Continue'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <p className="text-center text-gray-600 text-sm mt-8">
          By creating an account, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Login;
