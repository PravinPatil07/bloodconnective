
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getCurrentUser, getUserDonations } from '@/lib/storage';
import { calculateNextDonationDate } from '@/lib/types';
import { format } from 'date-fns';

const Achievements = () => {
  const user = getCurrentUser();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blood/5">
        <p className="text-gray-600">Please log in to view your achievements.</p>
      </div>
    );
  }
  
  const donations = getUserDonations(user.id);
  const lastDonation = user.lastDonation ? new Date(user.lastDonation) : null;
  const nextDonationDays = user.lastDonation ? calculateNextDonationDate(user.lastDonation) : 0;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blood/5 to-blood/20 pt-16 pb-24 px-4 md:px-8 md:ml-64">
      <div className="w-full max-w-2xl mx-auto">
        <div className="mb-6 flex items-center gap-2">
          <Link to="/" className="p-2 bg-white/80 rounded-full shadow-sm">
            <ArrowLeft size={18} className="text-blood" />
          </Link>
          <h1 className="text-2xl font-semibold text-gray-800">Achievements</h1>
        </div>
        
        <div className="space-y-6">
          {/* Next Donation Timer */}
          <div className="blood-card bg-blood p-6 text-white text-center animate-fade-in">
            <h3 className="text-xl font-medium mb-6">Next donation available in:</h3>
            
            <div className="relative w-36 h-36 bg-white/20 rounded-full flex items-center justify-center mx-auto">
              <div className="absolute inset-1 rounded-full bg-white/10 animate-pulse"></div>
              {nextDonationDays > 0 ? (
                <div className="text-4xl font-bold">{nextDonationDays}</div>
              ) : (
                <div className="text-2xl font-bold">Ready!</div>
              )}
            </div>
            
            <p className="mt-4 text-white/80">
              {nextDonationDays > 0 
                ? `You can donate again in ${nextDonationDays} days` 
                : 'You are eligible to donate blood now'}
            </p>
          </div>
          
          {/* Donation Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="blood-card bg-white p-6 text-center animate-fade-in">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Total Donated:</h3>
              
              <div className="relative w-28 h-28 bg-blood/10 rounded-full flex items-center justify-center mx-auto">
                <div className="text-3xl font-bold text-blood">{user.totalDonations}</div>
              </div>
              
              <p className="mt-4 text-gray-600">
                {user.totalDonations === 0 
                  ? 'Make your first donation today!' 
                  : user.totalDonations === 1 
                    ? 'You've saved a life!' 
                    : `You've saved ${user.totalDonations} lives!`}
              </p>
            </div>
            
            <div className="blood-card bg-white p-6 text-center animate-fade-in">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Last donated:</h3>
              
              <div className="relative w-28 h-28 bg-blood/10 rounded-full flex items-center justify-center mx-auto">
                {lastDonation ? (
                  <div className="text-xl font-medium text-blood">
                    {format(lastDonation, 'dd/MM/yyyy')}
                  </div>
                ) : (
                  <div className="text-xl font-medium text-blood/60">Never</div>
                )}
              </div>
              
              <p className="mt-4 text-gray-600">
                {lastDonation 
                  ? `It's been ${format(lastDonation, 'PP')} since your last donation` 
                  : 'You haven't donated blood yet'}
              </p>
            </div>
          </div>
          
          {/* Achievements */}
          <div className="blood-card bg-white p-6 animate-fade-in">
            <h3 className="text-xl font-medium text-gray-800 mb-4">Your Achievements</h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${user.totalDonations >= 1 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.totalDonations >= 1 ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <svg className={`w-6 h-6 ${user.totalDonations >= 1 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className={`font-medium ${user.totalDonations >= 1 ? 'text-green-800' : 'text-gray-600'}`}>First Time Donor</h4>
                    <p className={`text-sm ${user.totalDonations >= 1 ? 'text-green-600' : 'text-gray-500'}`}>Donate blood for the first time</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${user.totalDonations >= 3 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.totalDonations >= 3 ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <svg className={`w-6 h-6 ${user.totalDonations >= 3 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className={`font-medium ${user.totalDonations >= 3 ? 'text-green-800' : 'text-gray-600'}`}>Regular Donor</h4>
                    <p className={`text-sm ${user.totalDonations >= 3 ? 'text-green-600' : 'text-gray-500'}`}>Donate blood at least 3 times</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-lg border ${user.totalDonations >= 5 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200 opacity-50'}`}>
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${user.totalDonations >= 5 ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <svg className={`w-6 h-6 ${user.totalDonations >= 5 ? 'text-green-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className={`font-medium ${user.totalDonations >= 5 ? 'text-green-800' : 'text-gray-600'}`}>Life Saver</h4>
                    <p className={`text-sm ${user.totalDonations >= 5 ? 'text-green-600' : 'text-gray-500'}`}>Donate blood at least 5 times</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
