import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { twMerge } from 'tailwind-merge';
import { useSelector, useDispatch } from 'react-redux';
import { 
  LayoutDashboard, Users, Shield, BookOpen, FileText, Home, GraduationCap,
  CreditCard, Activity, Library, Calendar, MessageCircle, Video, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

export const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Default to closed for better mobile UX
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const { roles, activeRole } = useSelector((state: any) => state.auth);

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Sync nav items with Sidebar items for the mobile horizontal bar
  const getNavItems = () => {
    const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);

    if (currentRole === 'admin' || currentRole === 'super_admin') {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/roles', icon: Shield, label: 'Roles' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/programs', icon: Library, label: 'Programs' },
        { path: '/admin/batches', icon: Users, label: 'Batches' },
        { path: '/admin/schedules', icon: Calendar, label: 'Schedules' },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses' },
        { path: '/admin/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/admin/sessions', icon: Video, label: 'Sessions' },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments' },
      ];
    }
    
    if (currentRole === 'teacher') {
      return [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/classes', icon: BookOpen, label: 'Classes' },
        { path: '/teacher/students', icon: Users, label: 'Students' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    if (currentRole === 'parent') {
      return [
        { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parent/childcourses', icon: GraduationCap, label: 'Enroll Programs' },
        { path: '/parent/children', icon: Users, label: 'Children' },
        { path: '/parent/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/parent/payments', icon: CreditCard, label: 'Payments' },
      ];
    }

    if (currentRole === 'instructor') {
      return [
        { path: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/exams', icon: FileText, label: 'Exams' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    return [
      { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/student/courses', icon: BookOpen, label: 'Courses' },
      { path: '/student/chat', icon: MessageCircle, label: 'Chat' },
      { path: '/student/sessions', icon: Video, label: 'Live Classes' },
      { path: '/my-progress', icon: Activity, label: 'Progress' },
    ];
  };

  const navItems = getNavItems();
  const isExpanded = isSidebarOpen || isSidebarHovered;

  return (
    <div className="flex bg-gray-50 min-h-screen text-gray-800 font-sans">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar} 
        isHovered={isSidebarHovered}
        setIsHovered={setIsSidebarHovered}
      />
      
      <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out w-full max-w-full">
        <Header toggleSidebar={toggleSidebar} isOpen={isSidebarOpen} />
        
        {/* Mobile Horizontal Navigation: Horizontally scrollable list of dashboard pages */}
        <nav className="lg:hidden bg-white border-b border-gray-100 px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth sticky top-16 z-20 shadow-sm">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path!}
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
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full whitespace-nowrap text-xs font-bold transition-all bg-red-50 text-red-500 border border-red-100 hover:bg-red-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
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
