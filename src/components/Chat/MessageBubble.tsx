import React, { useState } from 'react';
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
  Bell,
  FileText
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
  onStarMessage: (id: string) => void;
  currentUser: any;
  isAnnouncement?: boolean;
  chatPermissions?: {
    canReply: boolean;
    canReact: boolean;
    canDelete: boolean;
    canReport: boolean;
    canForward: boolean;
  };
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  onReact,
  onReply,
  onStarMessage,
  currentUser,
  isAnnouncement,
  chatPermissions = {
    canReply: true,
    canReact: true,
    canDelete: false,
    canReport: true,
    canForward: true,
  }
}) => {
  const isSender = message.isSender;
  const actualSenderName = isSender 
    ? (message.senderName || (currentUser?.firstname || currentUser?.firstName ? (currentUser.firstname || currentUser.firstName) + " " + (currentUser?.lastname || currentUser?.lastName || "") : currentUser?.name) || 'You').trim() 
    : (message.senderName || (message.senderId?.firstname ? message.senderId.firstname + " " + (message.senderId.lastname || "") : null) || 'Unknown').trim();
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      id={`msg-${message._id || message.id}`}
      className={`flex flex-col mb-6 ${isAnnouncement ? 'items-center w-full px-2 md:px-6' : (isSender ? 'items-end' : 'items-start')}`}
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
              {message.time}
            </span>
          </>
        )}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="p-1"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-0 left-0 z-50 translate-y-6">
              <Dropdown
                width="w-48"
                onClose={() => setIsMenuOpen(false)}
                items={[
                  !isAnnouncement && {
                    icon: <Info className="h-4 w-4" />,
                    label: 'Message Info',
                    onClick: () => {
                      console.log('Message Info clicked');
                    },
                  },
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
                  chatPermissions.canForward && {
                    icon: <Forward className="h-4 w-4" />,
                    label: 'Forward',
                    onClick: () => {
                      console.log('Forward clicked');
                    },
                  },
                  !isAnnouncement && {
                    icon: <Star className="h-4 w-4" />,
                    label: 'Star Message',
                    onClick: () => {
                      onStarMessage(message.id);
                    },
                  },
                  chatPermissions.canReport && !isAnnouncement && {
                    icon: <Flag className="h-4 w-4" />,
                    label: 'Report',
                    onClick: () => {
                      console.log('Report clicked');
                    },
                  },
                  (chatPermissions.canDelete || isSender) && {
                    icon: <Trash2 className="h-4 w-4 text-red-500" />,
                    label: 'Delete',
                    destructive: true,
                    onClick: () => {
                      console.log('Delete clicked');
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
        {!isAnnouncement && !isSender && <Avatar src={getMediaUrl(message.senderAvatar || message.senderId?.avatar)} name={actualSenderName} size="md" />}
        {isAnnouncement && (
          <div className="flex-shrink-0 h-10 w-10 md:h-12 md:w-12 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center shadow-sm border border-blue-200 dark:border-blue-800">
            <Bell className="h-5 w-5 md:h-6 md:w-6" /> 
          </div>
        )}
        <div className={`flex flex-col gap-1 relative ${isAnnouncement ? 'flex-1 min-w-0' : ''}`}>
          <div
            className={`relative p-3 md:p-4 rounded-2xl ${
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

            {message.type === 'audio' ? (
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
                  <img
                    src={getMediaUrl(message.mediaUrl || message.imageUrl)}
                    alt="message-img"
                    className="max-w-xs md:max-w-sm lg:max-w-md rounded-lg object-cover"
                  />
                )}
                {message.text && (
                  <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap break-words max-w-xs md:max-w-sm lg:max-w-md">
                    {message.text.trim()}
                  </p>
                )}
              </div>
            )}

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
        {!isAnnouncement && isSender && <Avatar src={getMediaUrl(message.senderAvatar || message.senderId?.avatar)} name={actualSenderName} size="md" />}
      </div>
    </div>
  );
};

export default MessageBubble;
