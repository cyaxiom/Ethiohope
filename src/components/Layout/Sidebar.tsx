import React, { useState } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, PanelLeftClose, PanelLeft, Bot, 
  Home, BookOpen, FileText, CreditCard, Activity, Settings, User as UserIcon, LogOut, 
  GraduationCap, Library, Calendar, ChevronDown, ChevronUp, MessageCircle, Video
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion, AnimatePresence } from 'framer-motion';

type SubItem = { path: string; label: string };
type NavItem = { path?: string; icon: any; label: string; subItems?: SubItem[] };
import { logout } from '../../features/auth/authSlice';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, roles } = useSelector((state: any) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  // Define navigation items based on role
  const getNavItems = (): NavItem[] => {
    // Admin and Super Admin should see the same core management items
    if (roles.includes('admin') || roles.includes('super_admin')) {
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
    
    if (roles.includes('parent')) {
      return [
        { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parent/childcourses', icon: GraduationCap, label: 'Enroll Programs' },
        { path: '/parent/children', icon: Users, label: 'Children' },
        { path: '/parent/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/parent/payments', icon: CreditCard, label: 'Payments' },
      ];
    }

    if (roles.includes('instructor')) {
      return [
        { path: '/instructor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/exams', icon: FileText, label: 'Exams' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    // Default for students (including child role)
    if (roles.includes('student') || roles.includes('child')) {
      return [
        { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/student/courses', icon: BookOpen, label: 'Courses' },
        { path: '/student/chat', icon: MessageCircle, label: 'Chat' },
        { path: '/student/sessions', icon: Video, label: 'Live Classes' },
      ];
    }

    return [];
  };

  const navItems = getNavItems();

  return (
    <aside 
      className={twMerge(
        "fixed inset-y-0 left-0 bg-white shadow-[4px_0_12px_rgba(0,0,0,0.03)] border-r border-gray-100 z-50 flex flex-col transition-all duration-300 ease-in-out font-sans",
        // Desktop widths
        isOpen ? "lg:w-64" : "lg:w-20",
        // Mobile behavior: slide in/out
        isOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full lg:translate-x-0 lg:w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
        <Link to="/" className="flex items-center gap-3 overflow-hidden group/logo transition-all hover:opacity-80">
          <div className="flex-shrink-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-blue-100 group-hover/logo:scale-105 transition-transform">
             <Bot className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-black text-xl text-blue-900 whitespace-nowrap tracking-tighter">
              SSM Quiz
            </span>
          )}
        </Link>
        
        {isOpen && (
           <button 
             onClick={toggleSidebar}
             className="hidden lg:flex text-gray-300 hover:text-blue-500 hover:bg-blue-50 p-1.5 rounded-lg transition-all"
           >
             <PanelLeftClose className="w-5 h-5" />
           </button>
        )}
      </div>

      <nav className="flex-1 py-1 px-3 space-y-1 overflow-y-auto mt-4">
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
                    <motion.div whileHover={{ scale: 1.2, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                      <item.icon className="flex-shrink-0 w-5 h-5 transition-colors duration-300 text-gray-400 group-hover:text-blue-500" />
                    </motion.div>
                    {isOpen && (
                      <motion.span 
                        initial={{ opacity: 0, x: -10 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        className="whitespace-nowrap font-black"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </div>
                  {isOpen && (
                    <motion.div animate={{ rotate: isMenuOpen ? 180 : 0 }}>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                  
                  {/* Floating tooltip when closed */}
                  {!isOpen && (
                    <div className="fixed left-20 px-4 py-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-xl z-[100]">
                      {item.label}
                      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-blue-900" />
                    </div>
                  )}
                </button>
                {isMenuOpen && isOpen && (
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
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: [0, -5, 5, 0] }} 
                    transition={{ duration: 0.3 }}
                    className="relative"
                  >
                    <item.icon className={clsx("flex-shrink-0 w-5 h-5 transition-colors duration-300", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                    {isActive && (
                      <motion.div 
                        layoutId="active-dot"
                        className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white"
                      />
                    )}
                  </motion.div>
                  
                  {isOpen ? (
                    <motion.span 
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={clsx("whitespace-nowrap transition-all duration-300", isActive ? "font-black" : "font-bold")}
                    >
                      {item.label}
                    </motion.span>
                  ) : (
                    /* Floating Tooltip */
                    <div className="fixed left-20 px-4 py-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-xl z-[100]">
                      {item.label}
                      <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-y-[6px] border-y-transparent border-r-[6px] border-r-blue-900" />
                    </div>
                  )}
                  
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute left-0 w-1.5 h-8 bg-blue-600 rounded-r-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}

        <div className="my-4 px-3">
          <div className="h-px bg-gray-100 w-full" />
        </div>

        <h3 className={twMerge("text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 pl-4 transition-opacity duration-300", 
            !isOpen && "opacity-0 h-0 my-0 overflow-hidden" 
        )}>
           Settings
        </h3>

        <NavLink
            to="/profile"
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm",
                "hover:bg-blue-50/50 text-gray-500 hover:text-blue-600",
                isActive ? "bg-blue-50 text-blue-600 shadow-sm" : ""
              )
            }
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            </motion.div>
            {isOpen && <span className="whitespace-nowrap">Profile</span>}
            {!isOpen && (
              <div className="fixed left-20 px-4 py-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-xl z-[100]">
                Profile
              </div>
            )}
        </NavLink>

        <NavLink
            to="/settings"
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm",
                "hover:bg-blue-50/50 text-gray-500 hover:text-blue-600",
                isActive ? "bg-blue-50 text-blue-600 shadow-sm" : ""
              )
            }
          >
            <motion.div whileHover={{ scale: 1.2 }}>
              <Settings className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            </motion.div>
            {isOpen && <span className="whitespace-nowrap">Settings</span>}
            {!isOpen && (
              <div className="fixed left-20 px-4 py-2 bg-blue-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-xl z-[100]">
                Settings
              </div>
            )}
        </NavLink>

        <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm text-gray-500 hover:text-red-500 hover:bg-red-50"
          >
            <motion.div whileHover={{ scale: 1.2, x: 2 }}>
              <LogOut className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-red-500" />
            </motion.div>
            {isOpen && <span className="whitespace-nowrap">Logout</span>}
            {!isOpen && (
              <div className="fixed left-20 px-4 py-2 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 -translate-x-2 group-hover:translate-x-0 shadow-xl z-[100]">
                Logout
              </div>
            )}
        </button>
      </nav>

      <div className="p-4 border-t border-gray-100 mt-auto">
         <div className={clsx("flex items-center gap-3 p-2 bg-gray-50/50 rounded-2xl", !isOpen && "justify-center")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 text-white flex items-center justify-center font-black flex-shrink-0 shadow-lg shadow-blue-100">
               {user?.firstname?.charAt(0) || 'U'}
            </div>
            {isOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-black text-blue-900 truncate tracking-tight">{user?.firstname} {user?.lastname}</span>
                <span className="text-[10px] font-bold text-gray-400 truncate tracking-widest uppercase">{roles[0]}</span>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;

