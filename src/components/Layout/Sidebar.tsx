import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Shield, PanelLeftClose, PanelLeft, Bot } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/admin/roles', icon: Shield, label: 'Roles' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  return (
    <aside 
      className={twMerge(
        "fixed inset-y-0 left-0 bg-white shadow-[2px_0_8px_rgba(0,0,0,0.05)] border-r border-gray-100 z-20 flex flex-col transition-all duration-300 ease-in-out",
        isOpen ? "w-64" : "w-20"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="flex-shrink-0 bg-blue-500 rounded-lg p-1.5 flex items-center justify-center">
             <Bot className="w-5 h-5 text-white" />
          </div>
          {isOpen && (
            <span className="font-bold text-lg text-gray-800 whitespace-nowrap tracking-tight">
              EthioHope Admin
            </span>
          )}
        </div>
        
        {/* Mobile Toggle inside sidebar (optional, here for desktop collapse consistency) */}
        {isOpen && (
           <button 
             onClick={toggleSidebar}
             className="hidden lg:flex text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
           >
             <PanelLeftClose className="w-5 h-5" />
           </button>
        )}
        {!isOpen && (
           <button 
             onClick={toggleSidebar}
             className="hidden lg:flex w-full justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1 rounded-md transition-colors"
           >
             <PanelLeft className="w-5 h-5" />
           </button>
        )}
      </div>

      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
        <h3 className={twMerge("text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 pl-3 transition-opacity duration-300", 
            !isOpen && "opacity-0 h-0 my-0 overflow-hidden" 
        )}>
           Overview
        </h3>
        
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              clsx(
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative",
                "hover:bg-blue-50 text-gray-600 hover:text-blue-600 font-medium text-sm",
                isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-blue-500 rounded-r-full" />
                )}
                <item.icon className={clsx("flex-shrink-0 w-5 h-5 transition-colors", isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-500")} />
                {isOpen && <span className="whitespace-nowrap">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-100">
         <div className={clsx("flex items-center gap-3", !isOpen && "justify-center")}>
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
               A
            </div>
            {isOpen && (
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-semibold text-gray-800 truncate">Admin User</span>
                <span className="text-xs text-gray-500 truncate">admin@ethiohope.org</span>
              </div>
            )}
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;
