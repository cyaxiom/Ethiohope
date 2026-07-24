import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { clsx } from 'clsx';
import { useTheme } from '../../provider/ThemeProvider/ThemeProvider';

export const DashboardLayout: React.FC = () => {
  const { isDashboardDark } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <div
      className={clsx(
        'dashboard-shell flex min-h-screen font-sans transition-colors duration-300',
        isDashboardDark ? 'dark bg-[#0B1121] text-slate-100' : 'bg-gray-50 text-gray-800'
      )}
    >
      <Sidebar
        isMobileOpen={isMobileOpen}
        isCollapsed={isCollapsed}
        toggleCollapse={toggleCollapse}
        closeMobile={closeMobile}
      />

      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full min-w-0">
        <Header toggleMobileSidebar={toggleMobileSidebar} />

        <main
          className={clsx(
            'flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto w-full max-w-full transition-colors duration-300',
            isDashboardDark ? 'bg-[#0B1121]' : 'bg-gray-50'
          )}
        >
          <div className="max-w-[1600px] mx-auto w-full min-w-0">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-[2px] transition-opacity"
          onClick={closeMobile}
          aria-hidden
        />
      )}
    </div>
  );
};

export default DashboardLayout;
