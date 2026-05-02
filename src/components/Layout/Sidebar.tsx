import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, PanelLeftClose, PanelLeft, Bot, 
  Home, BookOpen, FileText, CreditCard, Activity, Settings, User as UserIcon, LogOut, 
  GraduationCap, Library, Calendar, ChevronDown, ChevronUp, MessageCircle, Video
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

import { logout } from '../../features/auth/authSlice';
import { hasPermission, hasAnyPermission } from '../../lib/rbac';

type SubItem = { path: string; label: string };
type NavItem = { path?: string; icon: any; label: string; subItems?: SubItem[]; permission?: string | string[] };

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isHovered: boolean;
  setIsHovered: (val: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isHovered, setIsHovered }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles, token, activeRole, permissions } = useSelector((state: any) => state.auth);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chats/unread-count`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTotalUnread(res.data.totalUnread || 0);
      } catch (err) {
        console.error('Error fetching unread count:', err);
      }
    };

    fetchUnreadCount();

    const handleCustomUpdate = () => fetchUnreadCount();
    window.addEventListener('chat-notification-update', handleCustomUpdate);

    const interval = setInterval(fetchUnreadCount, 120000);
    return () => {
      clearInterval(interval);
      window.removeEventListener('chat-notification-update', handleCustomUpdate);
    };
  }, [token]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const getNavItems = (): NavItem[] => {
    const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);

    if (currentRole === 'admin' || currentRole === 'super_admin') {
      const items = [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard.admin' },
        { path: '/admin/roles', icon: Shield, label: 'Roles', permission: 'role.read' },
        { path: '/admin/users', icon: Users, label: 'Users', permission: 'user.read' },
        { path: '/admin/programs', icon: Library, label: 'Programs', permission: 'program.read' },
        { path: '/admin/batches', icon: Users, label: 'Batches', permission: ['batch.read', 'batch.write', 'batch.create'] },
        { path: '/admin/schedules', icon: Calendar, label: 'Schedules', permission: ['schedule.read', 'schedule.write', 'schedule.create'] },
        { path: '/admin/courses', icon: BookOpen, label: 'Courses', permission: ['course.read', 'course.write', 'course.create'] },
        { path: '/admin/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
        { path: '/admin/sessions', icon: Video, label: 'Session', permission: ['session.read', 'session.write'] },
        { path: '/admin/payments', icon: CreditCard, label: 'Payments', permission: 'payment.read' },
      ];
      return items.filter(item => {
        if (!item.permission) return true;
        if (Array.isArray(item.permission)) return hasAnyPermission(permissions, item.permission);
        return hasPermission(permissions, item.permission);
      });
    }
    
    if (currentRole === 'parent') {
      const items = [
        { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parent/childcourses', icon: GraduationCap, label: 'Enroll Programs' },
        { path: '/parent/children', icon: Users, label: 'Children' },
        { path: '/parent/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
        { path: '/parent/payments', icon: CreditCard, label: 'Payments' },
      ];
      return items.filter(item => {
        if (!item.permission) return true;
        if (Array.isArray(item.permission)) return hasAnyPermission(permissions, item.permission);
        return hasPermission(permissions, item.permission);
      });
    }

    if (currentRole === 'instructor') {
      const items = [
        { path: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard.instructor' },
        { path: '/instructor/roles', icon: Shield, label: 'Roles', permission: 'role.read' },
        { path: '/instructor/users', icon: Users, label: 'Users', permission: 'user.read' },
        { path: '/instructor/programs', icon: Library, label: 'Programs', permission: 'program.read' },
        { path: '/instructor/batches', icon: Users, label: 'Batches', permission: ['batch.read', 'batch.write'] },
        { path: '/instructor/schedules', icon: Calendar, label: 'Schedules', permission: ['schedule.read', 'schedule.write'] },
        { path: '/instructor/courses', icon: BookOpen, label: 'Courses', permission: ['course.read', 'course.write'] },
        { path: '/instructor/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
        { path: '/instructor/sessions', icon: Video, label: 'Sessions', permission: ['session.read', 'session.write'] },
        { path: '/instructor/payments', icon: CreditCard, label: 'Payments', permission: 'payment.read' },
        // Legacy items
        { path: '/training', icon: BookOpen, label: 'Training', permission: 'training.read' },
        { path: '/exams', icon: FileText, label: 'Exams', permission: 'exam.read' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons', permission: 'lesson.read' },
      ];
      return items.filter(item => {
        if (!item.permission) return true;
        if (Array.isArray(item.permission)) return hasAnyPermission(permissions, item.permission);
        return hasPermission(permissions, item.permission);
      });
    }

    if (currentRole === 'student' || currentRole === 'child') {
      return [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/student/courses', icon: BookOpen, label: 'Courses' },
        { path: '/student/sessions', icon: Video, label: 'Live Classes' },
        { path: '/student/chat', icon: MessageCircle, label: 'Chat' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();
  const isExpanded = isOpen || isHovered;

  return (
    <aside 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={twMerge(
        "bg-white shadow-[4px_0_12px_rgba(0,0,0,0.03)] border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out font-sans",
        "lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0",
        isExpanded ? "lg:w-64" : "lg:w-20",
        "fixed inset-y-0 left-0 w-64 lg:translate-x-0",
        isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3 overflow-hidden group/logo transition-all hover:opacity-80">
          <div className="flex-shrink-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-blue-100 group-hover/logo:scale-105 transition-transform">
             <Bot className="w-5 h-5 text-white" />
          </div>
          <span className={clsx(
            "font-black text-xl text-blue-900 whitespace-nowrap tracking-tighter transition-all duration-300",
            isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
          )}>
            Ethiohope
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto mt-2">
        {navItems.map((item) => {
          if (item.subItems) {
            const isMenuOpen = openMenus[item.label];
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.label)}
                  className={clsx(
                    "w-full group flex items-center justify-between px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm",
                    "hover:bg-blue-50/50 text-gray-500 hover:text-blue-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="flex-shrink-0 w-5 h-5 transition-colors duration-300 text-gray-400 group-hover:text-blue-500" />
                    <span className={clsx(
                      "whitespace-nowrap font-black transition-all duration-300",
                      isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                      {item.label}
                    </span>
                  </div>
                  {isExpanded && (
                    <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </button>
                {isMenuOpen && isExpanded && (
                  <div className="pl-11 pr-3 py-1 space-y-1">
                    {item.subItems.map(subItem => (
                      <NavLink
                        key={subItem.path}
                        to={subItem.path}
                        className={({ isActive }) =>
                          clsx(
                            "flex items-center px-3 py-2 rounded-xl transition-all duration-300 text-xs font-bold",
                            "hover:bg-blue-50/50 text-gray-500 hover:text-blue-600",
                            isActive ? "bg-blue-50 text-blue-600" : ""
                          )
                        }
                      >
                        {subItem.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) =>
                clsx(
                  "group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm",
                  "hover:bg-blue-50/50 text-gray-500 hover:text-blue-600",
                  isActive ? "bg-blue-50 text-blue-600 shadow-sm shadow-blue-100/50" : ""
                )
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-3">
                    <item.icon className={clsx(
                      "flex-shrink-0 w-5 h-5 transition-colors duration-300", 
                      isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500"
                    )} />
                    
                    <span className={clsx(
                      "whitespace-nowrap transition-all duration-300",
                      isActive ? "font-black" : "font-bold",
                      isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
                    )}>
                      {item.label}
                    </span>
                  </div>

                  {item.label === 'Chat' && totalUnread > 0 && (
                    <span className={clsx(
                      "absolute bg-red-600 text-white text-[9px] font-black px-1 rounded-full min-w-[16px] h-[16px] flex items-center justify-center border-2 border-white shadow-sm z-10 transition-all",
                      isExpanded ? "right-3" : "top-2 right-2"
                    )}>
                      {totalUnread > 99 ? '99+' : totalUnread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm text-gray-500 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-red-500" />
            <span className={clsx(
              "whitespace-nowrap transition-all duration-300",
              isExpanded ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10 pointer-events-none"
            )}>
              Logout
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;

