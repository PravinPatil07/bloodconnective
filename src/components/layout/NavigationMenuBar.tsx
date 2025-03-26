
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Award, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getCurrentUser } from '@/lib/storage';

const NavigationMenuBar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();
  const currentUser = getCurrentUser();

  if (!currentUser) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md shadow-sm z-30 px-4 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
          <div className="text-blood font-bold text-lg">BloodDonor</div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-4">
          <NavLink to="/" active={location.pathname === "/"}>
            <Home size={18} />
            <span>Home</span>
          </NavLink>
          <NavLink to="/profile" active={location.pathname === "/profile"}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          <NavLink to="/achievements" active={location.pathname === "/achievements"}>
            <Award size={18} />
            <span>Achievements</span>
          </NavLink>
        </nav>

        {/* Mobile Navigation - Shown when menu is open */}
        {isOpen && (
          <div className="fixed inset-0 top-12 z-40 bg-white p-4 md:hidden">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink 
                to="/" 
                active={location.pathname === "/"} 
                onClick={() => setIsOpen(false)}
              >
                <Home size={18} />
                <span>Home</span>
              </MobileNavLink>
              <MobileNavLink 
                to="/profile" 
                active={location.pathname === "/profile"} 
                onClick={() => setIsOpen(false)}
              >
                <User size={18} />
                <span>Profile</span>
              </MobileNavLink>
              <MobileNavLink 
                to="/achievements" 
                active={location.pathname === "/achievements"} 
                onClick={() => setIsOpen(false)}
              >
                <Award size={18} />
                <span>Achievements</span>
              </MobileNavLink>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

// Desktop navigation link component
const NavLink = ({ 
  to, 
  active, 
  children 
}: { 
  to: string; 
  active: boolean; 
  children: React.ReactNode;
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${active 
          ? 'bg-blood/10 text-blood' 
          : 'hover:bg-blood/5 hover:text-blood text-gray-700'
        }`}
    >
      {children}
    </Link>
  );
};

// Mobile navigation link component
const MobileNavLink = ({ 
  to, 
  active, 
  children,
  onClick
}: { 
  to: string; 
  active: boolean; 
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-3 py-3 rounded-md text-base font-medium transition-colors
        ${active 
          ? 'bg-blood/10 text-blood' 
          : 'hover:bg-blood/5 hover:text-blood text-gray-700'
        }`}
    >
      {children}
    </Link>
  );
};

export default NavigationMenuBar;
