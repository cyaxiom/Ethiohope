import React from 'react';
import { X, MessageSquare, Mail, Shield, User as UserIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Avatar from './Avatar';

interface UserMiniProfileProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
  onStartChat: (userId: string) => void;
  currentUserId: string;
}

const UserMiniProfile: React.FC<UserMiniProfileProps> = ({ user, isOpen, onClose, onStartChat, currentUserId }) => {
  if (!user) return null;

  const isMe = (user._id || user.id) === currentUserId;
  const name = user.firstname ? `${user.firstname} ${user.lastname || ''}` : (user.name || 'User');
  const role = user.roles && user.roles.length > 0 ? (typeof user.roles[0] === 'string' ? user.roles[0] : user.roles[0].name) : 'Student';
  
  const getMediaUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('http') || url.startsWith('data:')) return url;
    const apiBase = (import.meta.env as any).VITE_API_BASE_URL || '';
    const serverRoot = apiBase.replace('/api/v1', '');
    return `${serverRoot}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Header / Background */}
            <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
            
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="px-6 pb-8 pt-0 -mt-12">
              <div className="flex flex-col items-center text-center">
                <div className="p-1.5 bg-white dark:bg-gray-900 rounded-full shadow-xl mb-4">
                  <Avatar 
                    src={getMediaUrl(user.avatar)} 
                    name={name} 
                    size="xl" 
                  />
                </div>
                
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                  {name}
                </h3>
                
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-200 dark:border-blue-800">
                    {role}
                  </span>
                  {user.status === 'active' && (
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-800">
                      Active
                    </span>
                  )}
                </div>

                <div className="w-full space-y-3 mb-8">
                  {user.email && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-left border border-gray-100 dark:border-gray-700">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email Address</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user.email}</p>
                      </div>
                    </div>
                  )}
                  
                  {user.country && (
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50 rounded-2xl text-left border border-gray-100 dark:border-gray-700">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <div className="min-w-0">
                        <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Location</p>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{user.city}, {user.country}</p>
                      </div>
                    </div>
                  )}
                </div>

                {!isMe && (
                  <button
                    onClick={() => {
                      onStartChat(user._id || user.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-[0.98]"
                  >
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Message</span>
                  </button>
                )}
                
                {isMe && (
                  <p className="text-sm text-gray-400 font-medium italic">This is your profile</p>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default UserMiniProfile;
