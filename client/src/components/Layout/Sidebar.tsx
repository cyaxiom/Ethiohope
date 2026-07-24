import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  Bot,
  BookOpen,
  FileText,
  CreditCard,
  Activity,
  GraduationCap,
  Library,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Video,
  LogOut,
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

import { logout } from '../../features/auth/authSlice';
import { hasPermission, hasAnyPermission } from '../../lib/rbac';

type SubItem = { path: string; label: string };
type NavItem = { path?: string; icon: any; label: string; subItems?: SubItem[]; permission?: string | string[] };
type NavSection = { title: string; items: NavItem[] };

interface SidebarProps {
  isMobileOpen: boolean;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  isCollapsed,
  toggleCollapse,
  closeMobile,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roles, token, activeRole, permissions } = useSelector((state: any) => state.auth);
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    if (!token) return;

    const fetchUnreadCount = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chats/unread-count`, {
          headers: { Authorization: `Bearer ${token}` },
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
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const filterByPermission = (items: NavItem[]) =>
    items.filter((item) => {
      if (!item.permission) return true;
      if (Array.isArray(item.permission)) return hasAnyPermission(permissions, item.permission);
      return hasPermission(permissions, item.permission);
    });

  const getNavSections = (): NavSection[] => {
    const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);

    if (currentRole === 'admin' || currentRole === 'super_admin') {
      return [
        {
          title: 'Overview',
          items: filterByPermission([
            { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard.admin' },
            { path: '/admin/tracks', icon: Activity, label: 'Analytics', permission: 'dashboard.admin' },
          ]),
        },
        {
          title: 'Access',
          items: filterByPermission([
            { path: '/admin/roles', icon: Shield, label: 'Roles', permission: 'role.read' },
            { path: '/admin/users', icon: Users, label: 'Users', permission: 'user.read' },
          ]),
        },
        {
          title: 'Academics',
          items: filterByPermission([
            { path: '/admin/programs', icon: Library, label: 'Programs', permission: 'program.read' },
            { path: '/admin/batches', icon: Users, label: 'Batches', permission: ['batch.read', 'batch.write', 'batch.create'] },
            { path: '/admin/schedules', icon: Calendar, label: 'Schedules', permission: ['schedule.read', 'schedule.write', 'schedule.create'] },
            { path: '/admin/courses', icon: BookOpen, label: 'Courses', permission: ['course.read', 'course.write', 'course.create'] },
          ]),
        },
        {
          title: 'Operations',
          items: filterByPermission([
            { path: '/admin/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
            { path: '/admin/sessions', icon: Video, label: 'Session', permission: ['session.read', 'session.write'] },
            { path: '/admin/payments', icon: CreditCard, label: 'Applications', permission: 'payment.read' },
          ]),
        },
      ].filter((section) => section.items.length > 0);
    }

    if (currentRole === 'parent') {
      return [
        {
          title: 'Menu',
          items: filterByPermission([
            { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { path: '/parent/childcourses', icon: GraduationCap, label: 'Enroll Programs' },
            { path: '/parent/children', icon: Users, label: 'Children' },
            { path: '/parent/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
            { path: '/parent/payments', icon: CreditCard, label: 'Payments' },
          ]),
        },
      ];
    }

    if (currentRole === 'instructor') {
      return [
        {
          title: 'Overview',
          items: filterByPermission([
            { path: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard', permission: 'dashboard.instructor' },
          ]),
        },
        {
          title: 'Access',
          items: filterByPermission([
            { path: '/instructor/roles', icon: Shield, label: 'Roles', permission: 'role.read' },
            { path: '/instructor/users', icon: Users, label: 'Users', permission: 'user.read' },
          ]),
        },
        {
          title: 'Academics',
          items: filterByPermission([
            { path: '/instructor/programs', icon: Library, label: 'Programs', permission: 'program.read' },
            { path: '/instructor/batches', icon: Users, label: 'Batches', permission: ['batch.read', 'batch.write'] },
            { path: '/instructor/schedules', icon: Calendar, label: 'Schedules', permission: ['schedule.read', 'schedule.write'] },
            { path: '/instructor/courses', icon: BookOpen, label: 'Courses', permission: ['course.read', 'course.write'] },
            { path: '/training', icon: BookOpen, label: 'Training', permission: 'training.read' },
            { path: '/exams', icon: FileText, label: 'Exams', permission: 'exam.read' },
            { path: '/lessons', icon: GraduationCap, label: 'Lessons', permission: 'lesson.read' },
          ]),
        },
        {
          title: 'Operations',
          items: filterByPermission([
            { path: '/instructor/chat', icon: MessageCircle, label: 'Chat', permission: ['chat.read', 'chat.write', 'chat.direct.start'] },
            { path: '/instructor/sessions', icon: Video, label: 'Sessions', permission: ['session.read', 'session.write'] },
            { path: '/instructor/payments', icon: CreditCard, label: 'Payments', permission: 'payment.read' },
          ]),
        },
      ].filter((section) => section.items.length > 0);
    }

    if (currentRole === 'student' || currentRole === 'child') {
      const items: NavItem[] = [
        { path: '/student/courses', icon: BookOpen, label: 'Courses' },
        { path: '/student/sessions', icon: Video, label: 'Live Classes' },
        { path: '/student/chat', icon: MessageCircle, label: 'Chat' },
      ];
      if (currentRole === 'student') {
        items.splice(2, 0, { path: '/student/payments', icon: CreditCard, label: 'Payments' });
      }
      return [{ title: 'Menu', items }];
    }

    return [];
  };

  const navSections = useMemo(() => getNavSections(), [activeRole, roles, permissions]);
  // Expanded by default; only collapses when user clicks the toggle (desktop)
  const isExpanded = !isCollapsed;

  const linkBase =
    'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative';
  const linkInactive = 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]';
  const linkActive = 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40';

  const renderNavItem = (item: NavItem) => {
    if (item.subItems) {
      const isMenuOpen = openMenus[item.label];
      return (
        <div key={item.label} className="space-y-1">
          <button
            onClick={() => toggleMenu(item.label)}
            className={clsx(linkBase, linkInactive, 'w-full justify-between')}
          >
            <div className="flex items-center gap-3 min-w-0">
              <item.icon className="flex-shrink-0 w-[18px] h-[18px] text-slate-400 group-hover:text-slate-200" />
              <span
                className={clsx(
                  'whitespace-nowrap transition-all duration-300',
                  isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                )}
              >
                {item.label}
              </span>
            </div>
            {isExpanded && (
              <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }}>
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </motion.div>
            )}
          </button>
          {isMenuOpen && isExpanded && (
            <div className="ml-3 pl-3 border-l border-slate-800 space-y-0.5">
              {item.subItems.map((subItem) => (
                <NavLink
                  key={subItem.path}
                  to={subItem.path}
                  onClick={closeMobile}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center px-3 py-2 rounded-lg text-xs font-medium transition-all',
                      isActive ? linkActive : linkInactive
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
        title={!isExpanded ? item.label : undefined}
        onClick={closeMobile}
        className={({ isActive }) => clsx(linkBase, isActive ? linkActive : linkInactive)}
      >
        {({ isActive }) => (
          <>
            <item.icon
              className={clsx(
                'flex-shrink-0 w-[18px] h-[18px] transition-colors',
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
              )}
            />
            <span
              className={clsx(
                'flex-1 whitespace-nowrap transition-all duration-300',
                isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              )}
            >
              {item.label}
            </span>
            {item.label === 'Chat' && totalUnread > 0 && (
              <span
                className={clsx(
                  'text-[10px] font-semibold px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-md transition-all',
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-300',
                  !isExpanded && 'absolute top-1.5 right-1.5 min-w-[16px] h-4 px-1 text-[9px]'
                )}
              >
                {totalUnread > 99 ? '99+' : totalUnread}
              </span>
            )}
          </>
        )}
      </NavLink>
    );
  };

  return (
    <aside
      className={twMerge(
        'bg-[#0B1121] border-r border-slate-800/80 z-50 flex flex-col transition-all duration-300 ease-in-out font-sans',
        'lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0',
        isExpanded ? 'lg:w-64' : 'lg:w-[72px]',
        'fixed inset-y-0 left-0 w-64 lg:translate-x-0',
        isMobileOpen ? 'translate-x-0 shadow-2xl shadow-black/40' : '-translate-x-full lg:translate-x-0'
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800/80 flex-shrink-0">
        <Link to="/" className="flex items-center gap-3 overflow-hidden min-w-0 group/logo">
          <div className="flex-shrink-0 w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-900/50 group-hover/logo:scale-105 transition-transform">
            <Bot className="w-[18px] h-[18px] text-white" />
          </div>
          <span
            className={clsx(
              'font-semibold text-[15px] text-white whitespace-nowrap tracking-tight transition-all duration-300',
              isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
            )}
          >
            Ethiohope
          </span>
        </Link>
        <button
          type="button"
          onClick={toggleCollapse}
          className="hidden lg:flex items-center justify-center w-7 h-7 rounded-md text-slate-500 hover:text-slate-200 hover:bg-white/[0.05] transition-all flex-shrink-0"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="sidebar-scroll flex-1 min-h-0 py-5 px-3 overflow-y-auto overscroll-contain">
        {navSections.map((section, index) => (
          <div key={section.title} className={clsx(index > 0 && 'mt-6')}>
            <p
              className={clsx(
                'px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500 transition-all duration-300',
                isExpanded ? 'opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'
              )}
            >
              {section.title}
            </p>
            <div className="space-y-0.5">{section.items.map(renderNavItem)}</div>
          </div>
        ))}

        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <button
            type="button"
            onClick={handleLogout}
            className={clsx(linkBase, 'w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10')}
          >
            <LogOut className="flex-shrink-0 w-[18px] h-[18px]" />
            <span
              className={clsx(
                'whitespace-nowrap transition-all duration-300',
                isExpanded ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
              )}
            >
              Logout
            </span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
