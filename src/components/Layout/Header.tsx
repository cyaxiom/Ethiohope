import React from 'react';
import { Menu, Search, Bell, Settings as SettingsIcon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  isOpen: boolean;
}

export const Header: React.FC<HeaderProps> = ({ toggleSidebar, isOpen }) => {
  const location = useLocation();

  // Simple title mapping based on route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin/dashboard':
        return 'Dashboard';
      case '/admin/roles':
        return 'Role Management';
      case '/admin/users':
        return 'Users';
      default:
        return 'Admin Portal';
    }
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
        <div className="hidden md:flex relative group">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 group-hover:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white w-64 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
          </button>
          
          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all hidden sm:block">
            <SettingsIcon className="w-5 h-5" />
          </button>
          
          <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shadow-sm cursor-pointer hover:shadow-md transition-all sm:ml-2">
            A
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
