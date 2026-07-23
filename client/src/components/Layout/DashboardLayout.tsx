import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard, Users, Shield, BookOpen, FileText, GraduationCap,
  CreditCard, Activity, Library, Calendar, MessageCircle, Video, LogOut
} from 'lucide-react';
import { clsx } from 'clsx';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../provider/ThemeProvider/ThemeProvider';

export const DashboardLayout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isDashboardDark } = useTheme();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  // Desktop: expanded by default; only collapses on explicit click
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { roles, activeRole } = useSelector((state: any) => state.auth);

  const toggleMobileSidebar = () => setIsMobileOpen((prev) => !prev);
  const closeMobile = () => setIsMobileOpen(false);
  const toggleCollapse = () => setIsCollapsed((prev) => !prev);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

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
        { path: '/admin/payments', icon: CreditCard, label: 'Applications' },
        { path: '/admin/tracks', icon: Activity, label: 'Analytics' },
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

        <nav
          className={clsx(
            'lg:hidden border-b px-4 py-2 flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth sticky top-16 z-20',
            isDashboardDark ? 'bg-[#0B1121] border-slate-800/80' : 'bg-white border-gray-100 shadow-sm'
          )}
        >
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-2 px-4 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all',
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/30'
                    : isDashboardDark
                      ? 'bg-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      : 'bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100'
                )
              }
            >
              <item.icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </NavLink>
          ))}

          <button
            onClick={handleLogout}
            className={clsx(
              'flex items-center gap-2 px-4 py-1.5 rounded-lg whitespace-nowrap text-xs font-semibold transition-all',
              isDashboardDark
                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                : 'bg-red-50 text-red-500 border border-red-100 hover:bg-red-100'
            )}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </nav>

        <main
          className={clsx(
            'flex-1 p-4 lg:p-6 overflow-y-auto w-full max-w-full transition-colors duration-300',
            isDashboardDark ? 'bg-[#0B1121]' : 'bg-gray-50'
          )}
        >
          <div className="max-w-[1600px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-[2px] transition-opacity"
          onClick={closeMobile}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
