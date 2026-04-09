import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Shield, PanelLeftClose, PanelLeft, Bot, 
  Home, BookOpen, FileText, CreditCard, Activity, Settings, User as UserIcon, LogOut, 
  GraduationCap, Library, Calendar
} from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
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

  // Define navigation items based on role
  const getNavItems = () => {
    // Admin and Super Admin should see the same core management items
    if (roles.includes('admin') || roles.includes('super_admin')) {
      return [
        { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/admin/roles', icon: Shield, label: 'Roles' },
        { path: '/admin/users', icon: Users, label: 'Users' },
        { path: '/admin/programs', icon: Library, label: 'Programs' },
        { path: '/admin/batches', icon: Users, label: 'Batches' },
        { path: '/admin/schedules', icon: Calendar, label: 'Schedules' },
      ];
    }
    
    if (roles.includes('teacher')) {
      return [
        { path: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/teacher/classes', icon: BookOpen, label: 'Classes' },
        { path: '/teacher/students', icon: Users, label: 'Students' },
        { path: '/teacher/assignments', icon: FileText, label: 'Assignments' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/exams', icon: FileText, label: 'Exams' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      ];
    }

    if (roles.includes('parent')) {
      return [
        { path: '/parent/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { path: '/parent/children', icon: Users, label: 'Children' },
        { path: '/parent/messages', icon: FileText, label: 'Messages' },
        { path: '/training', icon: BookOpen, label: 'Training' },
        { path: '/exams', icon: FileText, label: 'Exams' },
        { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
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

    // Default for students
    return [
      { path: '/', icon: Home, label: 'Home Page' },
      { path: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/training', icon: BookOpen, label: 'Training' },
      { path: '/exams', icon: FileText, label: 'Exams' },
      { path: '/lessons', icon: GraduationCap, label: 'Lessons' },
      { path: '/subscriptions', icon: CreditCard, label: 'Subscriptions' },
      { path: '/my-progress', icon: Activity, label: 'My progress' },
    ];
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
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex-shrink-0 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-blue-100">
             <Bot className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-black text-xl text-blue-900 whitespace-nowrap tracking-tighter">
              SSM Quiz
            </span>
          )}
        </div>
        
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
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
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
                <item.icon className={clsx("flex-shrink-0 w-5 h-5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}

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
            <UserIcon className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            {isOpen && <span className="whitespace-nowrap">Profile</span>}
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
            <Settings className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-blue-500" />
            {isOpen && <span className="whitespace-nowrap">Settings</span>}
        </NavLink>

        <button
            onClick={handleLogout}
            className="w-full group flex items-center gap-3 px-3 py-3 rounded-2xl transition-all duration-300 relative font-bold text-sm text-gray-500 hover:text-red-500 hover:bg-red-50"
          >
            <LogOut className="flex-shrink-0 w-5 h-5 text-gray-400 group-hover:text-red-500" />
            {isOpen && <span className="whitespace-nowrap">Logout</span>}
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

