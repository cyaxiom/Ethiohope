import React, { useState } from 'react';
import { Menu, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserProfileDropdown from '../Navbar/UserProfileDropdown';

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Simple title mapping based on route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (path.includes('/admin/roles')) return 'Role Management';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/teacher/dashboard')) return 'Teacher Dashboard';
    if (path.includes('/parent/dashboard')) return 'Parent Portal';
    if (path.includes('/student/dashboard')) return 'Student Dashboard';
    
    return 'Ethiohope Portal';
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileDropdownClose = () => {
    setIsProfileDropdownOpen(false);
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10 w-full transition-all duration-300">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 tracking-tight">
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div 
              onClick={handleProfileClick}
              className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-sm cursor-pointer hover:shadow-md transition-all sm:ml-2"
            >
              <User className="w-5 h-5" />
            </div>

            <UserProfileDropdown
              isOpen={isProfileDropdownOpen}
              onClose={handleProfileDropdownClose}
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
