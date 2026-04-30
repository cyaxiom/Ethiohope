import React, { useState } from 'react';
import dayjs from 'dayjs';
import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  Info,
  Reply,
  Smile,
  Forward,
  Star,
  Flag,
  Trash2,
  Edit3,
  Bell,
  FileText,
  Download,
  X,
  Check,
  CheckCheck
} from 'lucide-react';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import ReactionPicker from './ReactionPicker';

const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const apiBase = (import.meta.env as any).VITE_API_BASE_URL || '';
  const serverRoot = apiBase.replace('/api/v1', '');
  return `${serverRoot}${url.startsWith('/') ? '' : '/'}${url}`;
};

const isOnlyEmoji = (char: string) => {
  if (!char) return false;
  char = char.trim();
  const emojiOnly = /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\p{Emoji_Modifier})?|\p{Emoji_Component}|\u200D)+$/u;
  return emojiOnly.test(char);
};

interface MessageBubbleProps {
  message: any;
  onReact: (id: string, emoji: string) => void;
  onReply: (message: any) => void;
  onEdit: (message: any) => void;
  onDelete: (id: string) => void;
  onStarMessage: (id: string) => void;
  currentUser: any;
  isAnnouncement?: boolean;
  chatPermissions?: {
    canReply: boolean;
    canReact: boolean;
    canDeleteOwn: boolean;
    canDeleteAll: boolean;
    canReport: boolean;
    canForward: boolean;
    canEditOwn: boolean;
    canEditAll: boolean;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
  onReply,
  onEdit,
  onDelete,
  onStarMessage,
  currentUser,
  isAnnouncement,
  chatPermissions = {
    canReply: true,
    canReact: true,
    canDeleteOwn: true,
    canDeleteAll: false,
    canReport: true,
    canForward: true,
    canEditOwn: true,
    canEditAll: false,
  }
}) => {
  const isSender = message.isSender;
  const actualSenderName = isSender 
    ? (message.senderName || (currentUser?.firstname || currentUser?.firstName ? (currentUser.firstname || currentUser.firstName) + " " + (currentUser?.lastname || currentUser?.lastName || "") : currentUser?.name) || 'You').trim() 
    : (message.senderName || 
      (message.senderId?.firstname ? message.senderId.firstname + " " + (message.senderId.lastname || "") : 
       (message.childId?.firstname ? message.childId.firstname + " " + (message.childId.lastname || "") : null)) || 
      'Unknown'
    ).trim();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const senderIdStr = (message.senderId?._id || message.senderId || message.childId?._id || message.childId || '').toString();
  const isSeen = (message.isReadBy || []).some((id: any) => {
    const idStr = (id._id || id).toString();
    return idStr !== senderIdStr;
  });

  return (
    <>
      <div
      id={`msg-${message._id || message.id}`}
      className={`flex flex-col mb-6 w-full ${isAnnouncement ? 'items-center px-2 md:px-6' : (isSender ? 'items-end pl-10' : 'items-start pr-10')}`}
    >
      <div
        className={`flex items-center gap-2 mb-1 group ${!isAnnouncement && isSender ? 'flex-row-reverse' : ''}`}
      >
        {!isAnnouncement && (
          <>
            <span className="text-xs font-semibold text-card-foreground">
              {actualSenderName}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {message.time || (message.createdAt ? dayjs(message.createdAt).format('h:mm A') : '')}
            </span>
          </>
        )}
        <div className="relative">
          {!message.isDeleted && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {isMenuOpen && (
            <div className="absolute top-0 left-0 z-50 translate-y-6">
              <Dropdown
                width="w-48"
                onClose={() => setIsMenuOpen(false)}
                items={[
                  chatPermissions.canReply && {
                    icon: <Reply className="h-4 w-4" />,
                    label: 'Reply',
                    onClick: () => onReply(message),
                  },
                  chatPermissions.canReact && {
                    icon: <Smile className="h-4 w-4" />,
                    label: 'React',
                    onClick: () => {
                      setShowReactions(true);
                      setIsMenuOpen(false);
                    },
                  },
                  (chatPermissions.canEditAll || (chatPermissions.canEditOwn && isSender)) && {
                    icon: <Edit3 className="h-4 w-4 text-blue-500" />,
                    label: 'Edit',
                    onClick: () => {
                      onEdit(message);
                    },
                  },
                  (chatPermissions.canDeleteAll || (chatPermissions.canDeleteOwn && isSender)) && {
                    icon: <Trash2 className="h-4 w-4 text-red-500" />,
                    label: 'Delete',
                    destructive: true,
                    onClick: () => {
                      onDelete(message._id || message.id);
                    },
                  },
                ].filter(Boolean) as any}
              />
            </div>
          )}
        </div>
      </div>

      <div
        className={`flex gap-3 group relative w-full ${isAnnouncement ? 'max-w-3xl' : (isSender ? 'max-w-[85%] flex-row-reverse' : 'max-w-[85%]')}`}
      >
        {!isAnnouncement && !isSender && <Avatar src={getMediaUrl(message.senderAvatar || message.senderId?.avatar || message.childId?.avatar)} name={actualSenderName} size="md" />}
        {isAnnouncement && (
          <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800">
            <Bell className="h-5 w-5 md:h-6 md:w-6" /> 
          </div>
        )}
        <div className={`flex flex-col gap-1 relative ${isAnnouncement ? 'flex-1 min-w-0' : ''}`}>
          <div
            className={`relative p-3 md:p-4 rounded-2xl break-words max-w-full ${
              isAnnouncement
                ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200/60 dark:border-blue-800/60 shadow-md w-full rounded-tl-none'
                : (!isOnlyEmoji(message.text) && message.type !== 'audio'
                ? isSender
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md'
                  : 'bg-card text-card-foreground rounded-tl-none border border-border shadow-sm'
                : '')
              }`}
          >
            {isAnnouncement && (
              <div className="flex items-center justify-between gap-2 mb-3 pb-2 border-b border-blue-200/50 dark:border-blue-800/50">
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 flex items-center gap-1">
                  Official Announcement
                </span>
                <span className="text-[10px] text-blue-500/70 font-medium">{message.time}</span>
              </div>
            )}
            {showReactions && (
              <ReactionPicker
                onClose={() => setShowReactions(false)}
                onReact={(e) => onReact(message._id || message.id, e)}
              />
            )}
            {/* Message being replied to */}
            {message.replyTo && (
              <div
                className={`mb-2 rounded-lg px-3 py-2 text-xs
      ${isSender
                    ? 'bg-primary/10 border-l-4 border-primary'
                    : 'bg-muted border-l-4 border-muted-foreground'
                  }
    `}
              >
                <div className="font-semibold text-[11px] opacity-80 flex items-center gap-1">
                  <Reply className="h-2 w-2" />
                  Replying to {
                    message.replyTo.senderName || 
                    (message.replyTo.senderId?.firstname 
                      ? `${message.replyTo.senderId.firstname} ${message.replyTo.senderId.lastname || ''}` 
                      : (message.replyTo.childId?.firstname 
                        ? `${message.replyTo.childId.firstname} ${message.replyTo.childId.lastname || ''}` 
                        : 'Unknown'))
                  }
                </div>
                <div className="truncate text-[11px] opacity-70">
                  {message.replyTo.text
                    ? message.replyTo.text.length > 10
                      ? `${message.replyTo.text.slice(0, 10)}...`
                      : message.replyTo.text
                    : message.replyTo.type === 'image'
                      ? 'Image'
                      : message.replyTo.type === 'file'
                        ? 'File'
                        : message.replyTo.type === 'audio'
                          ? 'Audio'
                          : '...'}
                </div>
              </div>
            )}

            {message.isDeleted ? (
              <div className="flex items-center gap-2 text-muted-foreground italic opacity-70 py-1">
                <Trash2 className="w-3.5 h-3.5" />
                <span className="text-sm">This message was deleted</span>
              </div>
            ) : message.type === 'audio' ? (
              <div className="flex items-center gap-3 min-w-[220px]">
                <audio
                  controls
                  className="w-full outline-none bg-transparent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <source src={getMediaUrl(message.mediaUrl || message.audioUrl)} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            ) : message.type === 'file' ? (
              <div className="flex flex-col gap-2">
                {message.text && <p className="text-sm">{message.text}</p>}
                <div className="flex items-center gap-3 bg-muted p-3 rounded-xl border border-border min-w-[260px]">
                  <div className="h-12 w-12 rounded-lg bg-card flex items-center justify-center border border-border shadow-sm">
                    <FileText className="h-7 w-7 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate text-card-foreground">
                      {message.fileName}
                    </p>
                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                      {message.fileSize} <span className="mx-1">|</span>{' '}
                      <a 
                        href={getMediaUrl(message.mediaUrl)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary font-bold hover:underline"
                      >
                        Download
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            ) : isOnlyEmoji(message.text) ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: [-10, 10] }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 20,
                  duration: 0.5,
                }}
                className="text-5xl leading-tight"
              >
                {message.text.trim()}
              </motion.div>
            ) : (
              <div className={`flex flex-col gap-2 relative`}>
                {(message.mediaUrl || message.imageUrl) && (
                  <div className="relative group/img">
                    <img
                      src={getMediaUrl(message.mediaUrl || message.imageUrl)}
                      alt="message-img"
                      className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg object-cover cursor-zoom-in"
                      onClick={() => setIsFullscreen(true)}
                    />
                    <a 
                      href={getMediaUrl(message.mediaUrl || message.imageUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/60"
                      title="Download Image"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                )}
                {message.text && (
                  <div className="flex flex-col">
                    <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap break-words max-w-xs md:max-w-sm lg:max-w-md">
                      {message.text.trim()}
                    </p>
                    {message.isEdited && (
                      <span className={`text-[10px] mt-1 italic font-medium opacity-60 ${isSender ? 'text-primary-foreground text-right' : 'text-muted-foreground text-left'}`}>
                        (edited)
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-end gap-1 mt-1 -mb-1 opacity-70">
              <span className={`text-[9px] ${isSender ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                {message.time || (message.createdAt ? dayjs(message.createdAt).format('h:mm A') : '')}
              </span>
              {isSender && !message.isDeleted && (
                <div className="flex items-center">
                  {isSeen ? (
                    <CheckCheck className="h-3 w-3 text-primary-foreground" />
                  ) : (
                    <Check className="h-3 w-3 text-primary-foreground/60" />
                  )}
                </div>
              )}
            </div>

            {message.isStarred && (
              <Star className="absolute -top-1.5 -right-1.5 h-4 w-4 text-yellow-400 fill-yellow-400 border-2 border-white rounded-full bg-white" />
            )}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div
              className={`flex gap-1 mt-1.5 ${isAnnouncement ? 'justify-start px-2' : (isSender ? 'justify-end' : '')}`}
            >
              {message.reactions.map((r: any, i: number) => (
                <div
                  key={i}
                  onClick={(e) => {
                     e.stopPropagation();
                     if (chatPermissions.canReact) {
                       onReact(message.id || message._id, r.emoji);
                     }
                  }}
                  className={`flex items-center gap-1.5 border rounded-full px-2 py-1 text-xs shadow-sm cursor-pointer transition-all transform hover:scale-105 ${
                     r.users && currentUser && r.users.some((u: any) => u === currentUser._id || u._id === currentUser._id)
                       ? 'bg-primary/20 border-primary/40 text-primary dark:text-primary dark:bg-primary/30'
                       : 'bg-card border-border hover:bg-muted text-foreground'
                  }`}
                >
                  <span>{r.emoji}</span>
                  <span className="font-bold opacity-80">
                    {r.users?.length || r.count || 1}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {!isAnnouncement && isSender && <Avatar src={getMediaUrl(message.senderAvatar || message.senderId?.avatar || message.childId?.avatar)} name={actualSenderName} size="md" />}
      </div>
    </div>

      {isFullscreen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/90 flex flex-col items-center justify-center p-4 cursor-zoom-out backdrop-blur-sm"
          onClick={(e) => {
             e.preventDefault();
             e.stopPropagation();
             setIsFullscreen(false);
          }}
        >
          <div className="absolute top-4 right-4 flex gap-4">
            <a
              href={getMediaUrl(message.mediaUrl || message.imageUrl)}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => e.stopPropagation()}
              title="Download Full Image"
            >
              <Download className="h-6 w-6" />
            </a>
            <button 
              className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setIsFullscreen(false);
              }}
              title="Close"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <motion.img
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            src={getMediaUrl(message.mediaUrl || message.imageUrl)}
            alt="message-img-fullscreen"
            className="max-w-full max-h-[90vh] object-contain select-none shadow-2xl rounded-sm md:rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </motion.div>
      )}
    </>
  );
};

export default MessageBubble;
