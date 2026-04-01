import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { twMerge } from 'tailwind-merge';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className={twMerge(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out w-full",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        
        <main className="flex-1 p-6 overflow-y-auto">
          {/* Main content area */}
          <Outlet />
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-10 lg:hidden backdrop-blur-sm transition-opacity" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
