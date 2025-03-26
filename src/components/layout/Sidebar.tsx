
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Award, Home, LogOut, Menu, User, X } from 'lucide-react';
import { getCurrentUser, logout } from '@/lib/storage';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = getCurrentUser();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <>
      {/* Mobile menu button */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-white/80 shadow-md text-blood md:hidden"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-white/95 backdrop-blur-md shadow-xl z-50 transition-transform duration-300 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        {/* Close button (mobile only) */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 md:hidden"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="bg-blood text-white p-4 flex flex-col items-center justify-center space-y-2">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <div className="text-2xl font-bold text-blood">
              {currentUser.bloodGroup}
            </div>
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{currentUser.name}</h3>
            <p className="text-sm opacity-80">{currentUser.email || currentUser.location}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-4 space-y-2">
          <Link 
            to="/" 
            className={`blood-nav-item ${location.pathname === '/' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link 
            to="/profile" 
            className={`blood-nav-item ${location.pathname === '/profile' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <User size={20} />
            <span>Profile</span>
          </Link>
          <Link 
            to="/achievements" 
            className={`blood-nav-item ${location.pathname === '/achievements' ? 'active' : ''}`}
            onClick={() => setIsOpen(false)}
          >
            <Award size={20} />
            <span>Achievements</span>
          </Link>
          
          <hr className="my-4 border-gray-200" />
          
          <button 
            onClick={handleLogout}
            className="blood-nav-item w-full text-left"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;
