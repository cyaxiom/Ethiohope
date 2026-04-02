import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  User as UserIcon, 
  LogOut, 
  ShieldCheck, 
  PlusCircle, 
  MessageCircle, 
  Settings, 
  UserPlus, 
  RefreshCcw,
  Loader2,
  MailWarning,
  LayoutDashboard,
  BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

import { logout } from '../../features/auth/authSlice';
import { useVerifyEmailMutation } from '../../features/auth/authApi';
import { RootState } from '../../app/store';

interface UserProfileDropdownProps {
  onClose: () => void;
  isOpen: boolean;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const auth = useSelector((state: RootState) => state.auth);
  const user = auth?.user;
  const roles = auth?.roles || [];
  
  const [verifyEmail, { isLoading: isVerifying }] = useVerifyEmailMutation();

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

  const handleVerifyEmail = async () => {
    if (!user?.email) return;
    try {
      await verifyEmail({ email: user.email }).unwrap();
      toast.success('Verification email sent! Check your inbox.');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to send verification email');
    }
  };

  const isBasicUser = roles.length === 0;
  const isVerified = user?.isEmailVerified;

  return (
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
            
            {!isVerified && user?.email && (
              <div className="inline-flex mt-3 items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-amber-100">
                <MailWarning size={12} />
                Unverified
              </div>
            )}
          </div>

          {/* Menu Items */}
          <div className="p-2 space-y-1 bg-white">
            
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

            {/* Role-aware Dashboard Home link */}
            <button
              onClick={() => { 
                const mainRole = roles[0] || 'student';
                navigate(`/${mainRole}/dashboard`); 
                onClose(); 
              }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard Home</span>
            </button>

            <button
              onClick={() => { navigate('/dashboard/courses'); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <BookOpen className="w-4 h-4" />
              <span>My Courses</span>
            </button>

            {!isBasicUser && (
              <button
                onClick={() => { /* Placeholder logic */ onClose(); }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
              >
                <RefreshCcw className="w-4 h-4" />
                <span>Switch Profile</span>
              </button>
            )}

            <button
              onClick={() => { navigate('/dashboard/chats'); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chats</span>
            </button>

            <button
              onClick={() => { navigate('/dashboard/profile'); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <UserIcon className="w-4 h-4" />
              <span>Profile</span>
            </button>
            
            <button
              onClick={() => { navigate('/dashboard/settings'); onClose(); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>

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
  );
};

export default UserProfileDropdown;
