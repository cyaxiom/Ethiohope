import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { twMerge } from 'tailwind-merge';
import { useSelector } from 'react-redux';
import { 
  LayoutDashboard, Users, Shield, BookOpen, FileText, Home, GraduationCap,
  CreditCard, Activity
} from 'lucide-react';
import { clsx } from 'clsx';

export const DashboardLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed for better mobile UX
  const { roles } = useSelector((state: any) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  // Sync nav items with Sidebar items for the mobile horizontal bar
  const getNavItems = () => {
    if (roles.includes('admin') || roles.includes('super_admin')) {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/roles', icon: Shield, label: 'Roles' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
      ];
    }
    
    if (roles.includes('teacher')) {
      return [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/classes', icon: BookOpen, label: 'Classes' },
        { path: '/teacher/students', icon: Users, label: 'Students' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    if (roles.includes('parent')) {
      return [
        { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parent/children', icon: Users, label: 'Children' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    if (roles.includes('instructor')) {
      return [
        { path: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    return [
      { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/training', icon: BookOpen, label: 'Training' },
      { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      { path: '/my-progress', icon: Activity, label: 'Progress' },
    ];
  };

  const navItems = getNavItems();

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans overflow-x-hidden">
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div 
        className={twMerge(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        )}
      >
        <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        
        {/* Mobile Horizontal Navigation: Horizontally scrollable list of dashboard pages */}
        <nav className="lg:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth sticky top-16 z-20 shadow-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                clsx(
                  "flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all",
                  isActive 
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100 scale-105" 
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                )
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <main className="flex-1 p-4 lg:p-6 overflow-y-auto w-full max-w-full">
          {/* Main content area */}
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-[2px] transition-opacity animate-in fade-in duration-300" 
          onClick={toggleSidebar}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
