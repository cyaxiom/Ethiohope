import React, { useState } from 'react';
import { Menu, User, Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import UserProfileDropdown from '../Navbar/UserProfileDropdown';
import { useTheme } from '../../provider/ThemeProvider/ThemeProvider';
import { clsx } from 'clsx';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ toggleMobileSidebar }) => {
  const location = useLocation();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isDashboardDark, toggleDashboardTheme } = useTheme();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/admin/dashboard')) return 'Admin Dashboard';
    if (path.includes('/admin/roles')) return 'Role Management';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/programs')) return 'Programs';
    if (path.includes('/admin/batches')) return 'Batches';
    if (path.includes('/admin/schedules')) return 'Schedules';
    if (path.includes('/admin/courses')) return 'Courses';
    if (path.includes('/admin/payments')) return 'Applications';
    if (path.includes('/admin/chat')) return 'Chat';
    if (path.includes('/admin/sessions')) return 'Sessions';
    if (path.includes('/admin/tracks')) return 'Analytics';
    if (path.includes('/teacher/dashboard')) return 'Teacher Dashboard';
    if (path.includes('/parent/dashboard')) return 'Parent Portal';
    if (path.includes('/student/dashboard')) return 'Student Dashboard';
    if (path.includes('/instructor/')) return 'Instructor Portal';

    return 'Ethiohope Portal';
  };

  const handleProfileClick = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleProfileDropdownClose = () => {
    setIsProfileDropdownOpen(false);
  };

  return (
    <header
      className={clsx(
        'h-14 sm:h-16 border-b flex items-center justify-between gap-2 px-3 sm:px-6 sticky top-0 z-[100] w-full transition-colors duration-300',
        isDashboardDark
          ? 'bg-[#0B1121] border-slate-800/80 text-slate-100'
          : 'bg-white border-gray-100 text-gray-800'
      )}
    >
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <button
          onClick={toggleMobileSidebar}
          className={clsx(
            'lg:hidden p-2 rounded-md focus:outline-none transition-colors flex-shrink-0',
            isDashboardDark
              ? 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
          )}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1
          className={clsx(
            'text-base sm:text-xl font-semibold tracking-tight truncate',
            isDashboardDark ? 'text-white' : 'text-gray-800'
          )}
        >
          {getPageTitle()}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
        <button
          type="button"
          onClick={toggleDashboardTheme}
          aria-label={isDashboardDark ? 'Switch to light mode' : 'Switch to dark mode'}
          className={clsx(
            'p-2 rounded-lg transition-colors',
            isDashboardDark
              ? 'text-slate-300 hover:text-white hover:bg-white/[0.05] bg-slate-800/60'
              : 'text-slate-600 hover:text-slate-900 hover:bg-gray-100 bg-gray-50'
          )}
        >
          {isDashboardDark ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={handleProfileClick}
            aria-label="Open profile menu"
            aria-expanded={isProfileDropdownOpen}
            className="h-9 w-9 sm:h-10 sm:w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-900/30 cursor-pointer hover:shadow-md transition-all"
          >
            <User className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <UserProfileDropdown
            isOpen={isProfileDropdownOpen}
            onClose={handleProfileDropdownClose}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
