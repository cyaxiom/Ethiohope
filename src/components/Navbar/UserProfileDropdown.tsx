import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  MessageCircle, 
  Settings, 
  RefreshCcw,
  Loader2,
  MailWarning,
  LayoutDashboard,
  BookOpen,
  Home as HomeIcon,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { ChevronDown, Check } from 'lucide-react';

import { logout, setActiveRole } from '../../features/auth/authSlice';
import { useVerifyEmailMutation } from '../../features/auth/authApi';
import { RootState } from '../../app/store';
import ChangePasswordModal from './ChangePasswordModal';

interface UserProfileDropdownProps {
  onClose: () => void;
  isOpen: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;
  const roles = auth?.roles || [];
  const activeRole = auth?.activeRole;
  
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [isSwitchingProfile, setIsSwitchingProfile] = useState(false);

  // Handle outside click to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleLogout = () => {
    dispatch(logout());
    onClose();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleSwitchRole = (role: string) => {
    setIsSwitchingProfile(false);
    onClose();
    
    // IMPORTANT: We update localStorage directly instead of dispatching to Redux!
    // Dispatching to Redux triggers an immediate re-render, causing Guard.tsx 
    // to flash "Access Denied" before the reload happens. 
    localStorage.setItem('activeRole', role);
    toast.success(`Switched to ${role} profile`);
    
    // Redirect to the appropriate dashboard with a full page reload
    // The newly loaded app will read the updated activeRole from localStorage.
    let targetUrl = '/';
    if (role === 'super_admin' || role === 'admin') targetUrl = '/admin/dashboard';
    else if (role === 'instructor') targetUrl = '/instructor/dashboard';
    else if (role === 'parent') targetUrl = '/parent/dashboard';
    else if (role === 'student' || role === 'child') targetUrl = '/student/dashboard';
    
    setTimeout(() => {
      window.location.href = targetUrl;
    }, 100); // Tiny delay to ensure toast and localStorage are ready
  };

  const handleVerifyEmail = async () => {
    if (!user?.email) return;
    try {
      await verifyEmail({ email: user.email }).unwrap();
      toast.success('Verification email sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send verification email');
    }
  };

  // ─── Role-based visibility logic ─────────────────────────────────
  const isVerified = user?.isEmailVerified;
  const isProfileComplete = user?.isProfileComplete;

  // "Only user" means the ONLY role is 'user' (the default role everyone gets)
  const isOnlyUserRole = roles.length === 0 || (roles.length === 1 && roles[0] === 'user');

  // Has meaningful roles beyond 'user' (parent, instructor, admin, etc.)
  const hasUpgradedRoles = !isOnlyUserRole;

  // Has multiple meaningful roles for switching
  const meaningfulRoles = roles.filter(r => r !== 'user');
  const canSwitchProfile = meaningfulRoles.length > 1;


  // Show "My Courses" / "View Courses" only if profile is completed or has upgraded roles
  const showCourses = hasUpgradedRoles || isProfileComplete;

  // Dashboard navigation based on active role
  const getPrimaryDashboard = () => {
    const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);
    if (!currentRole) return '/';
    if (currentRole === 'super_admin' || currentRole === 'admin') return '/admin/dashboard';
    if (currentRole === 'instructor') return '/instructor/dashboard';
    if (currentRole === 'parent') return '/parent/dashboard';
    if (currentRole === 'student' || currentRole === 'child') return '/student/dashboard';
    return '/';
  };

  const getChatUrl = () => {
    if (roles.includes('super_admin') || roles.includes('admin')) return '/admin/chat';
    if (roles.includes('instructor')) return '/instructor/chat'; // Assuming there could be one
    if (roles.includes('parent')) return '/parent/chat';
    if (roles.includes('student') || roles.includes('child')) return '/student/chat';
    return '/dashboard/chats';
  };

  // Helper visibility checks
  const isAtHome = location.pathname === '/';
  const isAtDashboard = 
    location.pathname.startsWith('/admin') || 
    location.pathname.startsWith('/teacher') || 
    location.pathname.startsWith('/parent') || 
    location.pathname.startsWith('/student') || 
    location.pathname.startsWith('/instructor');

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            ref={dropdownRef}
            className="absolute right-0 mt-3 w-72 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 overflow-hidden z-[999]"
          >
            {/* User Info Header */}
            <div className="p-5 bg-gradient-to-br from-blue-50 to-white border-b border-gray-100 text-center">
              <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl mx-auto flex items-center justify-center text-white text-2xl font-black shadow-lg mb-3 ring-4 ring-white">
                {user?.firstname?.charAt(0) || user?.name?.charAt(0) || 'U'}
              </div>
              <h4 className="text-gray-900 font-bold tracking-tight">
                {user?.firstname ? `${user?.firstname} ${user?.lastname || ''}` : (user?.name || 'User')}
              </h4>
              <p className="text-gray-500 text-xs truncate max-w-full px-2">{user?.email || 'No email provided'}</p>
              
              {/* Role badges */}
              <div className="flex items-center justify-center gap-1.5 mt-2 flex-wrap">
                {(() => {
                  const displayRoles = roles.length > 1 ? roles.filter(r => r !== 'user') : (roles.length > 0 ? roles : ['user']);
                  return displayRoles.map((role) => (
                    <span
                      key={role}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${role === 'user' 
                          ? 'bg-gray-100 text-gray-500' 
                          : 'bg-blue-100 text-blue-600'
                        }
                      `}
                    >
                      {role}
                    </span>
                  ));
                })()}
              </div>

              {!isVerified && user?.email && (
                <div className="inline-flex mt-3 items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                  <MailWarning size={12} />
                  Unverified
                </div>
              )}
            </div>

            {/* Menu Items */}
            <div className="p-2 space-y-1 bg-white">
              
              {/* 0. Home - Hide if already at home */}
              {!isAtHome && (
                <button
                  onClick={() => { navigate('/'); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <HomeIcon className="w-4 h-4" />
                  <span>Home</span>
                </button>
              )}

              {/* 1. Verify Email (if not verified) */}
              {!isVerified && user?.email && (
                <button
                  onClick={handleVerifyEmail}
                  disabled={isVerifying}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-xl transition-all group"
                >
                  {isVerifying ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ShieldCheck className="w-4 h-4" />
                  )}
                  <span>Verify Email</span>
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                </button>
              )}

              {/* 2. Dashboard - show only if user has upgraded roles AND not already at dashboard */}
              {hasUpgradedRoles && !isAtDashboard && (
                <button
                  onClick={() => { navigate(getPrimaryDashboard()); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
              )}

              {/* 4. Switch Profile - only show if user has multiple meaningful roles */}
              {canSwitchProfile && (
                <div className="w-full">
                  <button
                    onClick={() => setIsSwitchingProfile(!isSwitchingProfile)}
                    className="w-full flex items-center justify-between px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <RefreshCcw className="w-4 h-4" />
                      <span>Switch Profile</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isSwitchingProfile ? 'rotate-180' : ''}`} />
                  </button>
                  
                  <AnimatePresence>
                    {isSwitchingProfile && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden pl-11 pr-2 space-y-1 mt-1"
                      >
                        {meaningfulRoles.map(role => (
                          <button
                            key={role}
                            onClick={() => handleSwitchRole(role)}
                            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                              activeRole === role 
                                ? 'bg-blue-100 text-blue-700' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                            }`}
                          >
                            <span className="capitalize">{role}</span>
                            {activeRole === role && <Check className="w-3 h-3" />}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              
              {!roles.includes('child') && !roles.includes('student') && (
                <button
                  onClick={() => { setShowPasswordModal(true); onClose(); }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  <KeyRound className="w-4 h-4" />
                  <span>Change Password</span>
                </button>
              )}

              <div className="h-px bg-gray-50 my-1 mx-2" />

              {/* Logout - Always Show */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>


      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};

export default UserProfileDropdown;
