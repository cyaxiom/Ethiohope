'use client';
import React, { useMemo } from 'react';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { DS } from '@/constants/designSystem';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
// Reusable design-system class helpers
const ICON_BTN = `${DS.buttons.base} ${DS.buttons.sizes.sm} ${DS.buttons.variants.ghost}`;
const ICON_BTN_MD = `${DS.buttons.base} ${DS.buttons.sizes.md} ${DS.buttons.variants.ghost}`;
const PRIMARY_ICON_BTN = `${DS.buttons.base} ${DS.buttons.sizes.sm} ${DS.buttons.variants.primary}`;
import {
  Search,
  MoreVertical,
  MessageSquarePlus,
  UserCircle,
  UserPlus,
  Pin,
  CheckCheck,
  Video,
  Smile,
  Send,
  ArrowLeft,
  Phone,
  Info,
  Bell,
  X,
  Mic,
  FileText,
  Camera,
  ImageIcon,
  MapPin,
  User,
  Star,
  Forward,
  Reply,
  Trash2,
  EyeOff,
  VolumeX,
  Play,
  MoreHorizontal,
  ChevronRight,
  UserX,
  Flag,
  ChevronDown,
  MessageCircleX,
  MessageSquare,
  RefreshCw,
  Lock,
} from 'lucide-react';

import { debounce } from '../../lib/utils';

// --- Components ---

const Avatar = ({ src, name, isOnline, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-12 w-12 text-base',
    xl: 'h-24 w-24 text-3xl',
  };

  const getInitials = (userName) => {
    if (!userName) return '?';
    const names = userName.trim().split(' ').filter(Boolean);
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return userName.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (userName) => {
    if (!userName || userName === '?' || userName === 'Unknown' || userName === 'You') return 'bg-gray-200 text-gray-700 border-gray-300';
    const colors = [
      'bg-red-100 text-red-700 border-red-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-amber-100 text-amber-700 border-amber-200',
      'bg-emerald-100 text-emerald-700 border-emerald-200',
      'bg-cyan-100 text-cyan-700 border-cyan-200',
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200',
      'bg-violet-100 text-violet-700 border-violet-200',
      'bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200',
      'bg-rose-100 text-rose-700 border-rose-200',
    ];
    let hash = 0;
    for (let i = 0; i < userName.length; i++) {
        hash = userName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  const isDefaultImage = !src || src.includes('placeholder') || src.includes('Apen.png');
  const colorClass = getAvatarColor(name);

  return (
    <div className={`relative flex-shrink-0 ${sizes[size]} rounded-full flex items-center justify-center font-bold border ${colorClass}`}>
      {!isDefaultImage ? (
        <>
          <img
            src={src}
            alt={name || "avatar"}
            className="rounded-full object-cover h-full w-full absolute inset-0 z-10"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
          <span className="z-0">{getInitials(name)}</span>
        </>
      ) : (
        <span>{getInitials(name)}</span>
      )}
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success z-20" />
      )}
    </div>
  );
};

const Dropdown = ({ items, onClose, width = 'w-56' }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    const clickOut_ = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', clickOut_);
    return () => {
      document.removeEventListener('mousedown', clickOut_);
    };
  }, []);

  return (
    <div
      ref={modalRef}
      onClick={(e) => e.stopPropagation()}
      className={`${width} bg-card border border-border rounded-xl shadow-xl z-30 p-1 py-2
      animate-in fade-in zoom-in duration-150 text-foreground`}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={(e) => {
            e.stopPropagation();
            console.log(`Clicked on ${item.label}`);
            item.onClick?.();
            onClose();
          }}
          className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm
            hover:bg-muted rounded-lg transition-colors text-left
            ${item.destructive ? 'text-error' : 'text-foreground'}`}
        >
          <div className="flex items-center gap-3">
            {item.icon && <span className="opacity-70">{item.icon}</span>}
            {item.label}
          </div>

          {item.badge !== undefined && (
            <span
              className="h-5 min-w-[1.25rem] flex items-center justify-center
              px-1.5 rounded-full bg-primary text-primary-foreground
              text-[10px] font-bold"
            >
              {item.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
};

const ReactionPicker = ({ onReact, onClose }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '🙏'];
  return (
    <>
      {/* <div className="fixed inset-0 z-40" onClick={onClose} /> */}
      <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-full shadow-lg p-1.5 flex gap-1 animate-in slide-in-from-bottom-2 duration-200">
        {emojis.map((emoji) => (
          <button
            type="button"
            key={emoji}
            onClick={() => onReact(emoji)}
            className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full text-lg transition-transform hover:scale-125"
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
};
const MessageBubble = ({
  message,
  onOpenContext,
  onReact,
  onReply,
  onStarMessage,
  currentUser,
}) => {
  const isSender = message.isSender;
  const actualSenderName = isSender 
    ? (message.senderName || (currentUser?.firstname || currentUser?.firstName ? (currentUser.firstname || currentUser.firstName) + " " + (currentUser?.lastname || currentUser?.lastName || "") : currentUser?.name) || 'You').trim() 
    : (message.senderName || (message.senderId?.firstname ? message.senderId.firstname + " " + (message.senderId.lastname || "") : null) || 'Unknown').trim();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  const isOnlyEmoji = (char) => {
    if (!char) return false;
    //trim
    char = char.trim();
    //can be multiple emojis,
    const emojiOnly =
      /^(?:\p{Emoji_Presentation}|\p{Emoji}\uFE0F|\p{Emoji_Modifier_Base}(?:\p{Emoji_Modifier})?|\p{Emoji_Component}|\u200D)+$/u;
    return emojiOnly.test(char);
  };

  return (
    <div
      className={`flex flex-col mb-6 ${isSender ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`flex items-center gap-2 mb-1 group ${isSender ? 'flex-row-reverse' : ''
          }`}
      >
        <span className="text-xs font-semibold text-card-foreground">
          {actualSenderName}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {message.time}
        </span>
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
                  {
                    icon: <Info className="h-4 w-4" />,
                    label: 'Message Info',
                    onClick: () => {
                      console.log('Message Info clicked');
                    },
                  },
                  {
                    icon: <Reply className="h-4 w-4" />,
                    label: 'Reply',
                    onClick: () => onReply(message),
                  },
                  {
                    icon: <Smile className="h-4 w-4" />,
                    label: 'React',
                    onClick: () => {
                      setShowReactions(true);
                      setIsMenuOpen(false);
                    },
                  },
                  {
                    icon: <Forward className="h-4 w-4" />,
                    label: 'Forward',
                    onClick: () => {
                      console.log('Forward clicked');
                    },
                  },
                  {
                    icon: <Star className="h-4 w-4" />,
                    label: 'Star Message',
                    onClick: () => {
                      onStarMessage(message.id);
                    },
                  },
                  {
                    icon: <Flag className="h-4 w-4" />,
                    label: 'Report',
                    onClick: () => {
                      console.log('Report clicked');
                    },
                  },
                  {
                    icon: <Trash2 className="h-4 w-4 text-red-500" />,
                    label: 'Delete',
                    destructive: true,
                    onClick: () => {
                      console.log('Delete clicked');
                    },
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      {/*  */}
      <div
        className={`flex gap-3 max-w-[85%] group relative ${isSender ? 'flex-row-reverse' : ''
          }`}
      >
        {!isSender && <Avatar src={message.senderAvatar || message.senderId?.avatar} name={actualSenderName} size="md" />}
        <div className="flex flex-col gap-1 relative">
          <div
            className={`relative p-3 rounded-2xl ${!isOnlyEmoji(message.text) && message.type !== 'audio'
                ? isSender
                  ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md'
                  : 'bg-card text-card-foreground rounded-tl-none border border-border shadow-sm'
                : ''
              }`}
          >
            {showReactions && (
              <ReactionPicker
                onClose={() => setShowReactions(false)}
                onReact={(e) => onReact(message.id, e)}
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
                <div className="font-semibold text-[11px] opacity-80">
                  Replying to {message.replyTo.senderName}
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
                  onClick={() => console.log('clicked audio')}
                >
                  <source src={message.audioUrl} />
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
                      <button className="text-primary font-bold hover:underline">
                        Download
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            ) : message.type === 'link' ? (
              <div className="flex flex-col gap-2 min-w-[320px]">
                <p className="text-sm break-all font-medium text-primary hover:underline cursor-pointer">
                  {message.text}
                </p>
                {message.linkPreview && (
                  <div className="rounded-2xl overflow-hidden border border-border bg-muted">
                    <img
                      src={
                        message.linkPreview.image || '/previewPlaceholder.jpg'
                      }
                      alt="preview"
                      className="w-full aspect-video object-cover"
                    />
                    <div className="p-10 flex items-center justify-center bg-muted">
                      <span className="text-4xl font-bold text-muted-foreground">
                        345 x 126
                      </span>
                    </div>
                  </div>
                )}
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
              <div
                className={`flex flex-col gap-2 relative 
               `}
              >
                {message.imageUrl && (
                  <img
                    src={message.imageUrl}
                    alt="message-img"
                    className="
                  max-w-xs md:max-w-sm lg:max-w-md rounded-lg object-cover
                    "
                  />
                )}

                <p className="text-sm leading-relaxed text-card-foreground whitespace-pre-wrap break-words  max-w-xs md:max-w-sm lg:max-w-md ">
                  {message.text.trim()}
                </p>
              </div>
            )}

            {message.isStarred && (
              <Star className="absolute -top-1.5 -right-1.5 h-4 w-4 text-yellow-400 fill-yellow-400 border-2 border-white rounded-full bg-white" />
            )}
          </div>

          {message.reactions && message.reactions.length > 0 && (
            <div
              className={`flex gap-1 mt-1.5 ${isSender ? 'justify-end' : ''}`}
            >
              {message.reactions.map((r, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 bg-card border border-border rounded-full px-2 py-1 text-xs shadow-sm cursor-pointer hover:bg-muted transition-all transform hover:scale-105"
                >
                  <span>{r.emoji}</span>
                  <span className="font-bold text-muted-foreground">
                    {r.count}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
        {isSender && <Avatar src={message.senderAvatar || message.senderId?.avatar} name={actualSenderName} size="md" />}
      </div>
    </div>
  );
};
//Camera Component
const CameraComponent = ({ onCapture, onClose }) => {
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        streamRef.current = stream;

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
      }
    };

    startCamera();

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);

  const handleCapture = () => {
    const video = videoRef.current;
    if (!video) return;

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture(canvas.toDataURL('image/png'));
  };

  return (
    <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
      {/* Video Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-end bg-gradient-to-b from-black/60 to-transparent">
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition"
        >
          ✕
        </button>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 pb-6 pt-4 flex justify-center bg-gradient-to-t from-black/60 to-transparent">
        <button
          onClick={handleCapture}
          className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/30 active:scale-95 transition"
        />
      </div>
    </div>
  );
};
// Audio Recorder Component
const AudioRecorder = ({ onSave, onClose }) => {
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const audioRef = useRef(null);
  const chunksRef = useRef([]);

  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [seconds, setSeconds] = useState(0);

  // timer
  useEffect(() => {
    if (!isRecording) return;

    const interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;
    chunksRef.current = [];

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    recorder.start();
    setSeconds(0);
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setIsRecording(false);
  };

  const handleSave = () => {
    onSave(audioUrl);
    onClose();
  };

  return (
    <div className="relative w-full max-w-md mx-auto bg-background rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          {isRecording ? 'Recording...' : 'Share Audio'}
        </h2>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20"
        >
          ✕
        </button>
      </div>

      {/* Timer */}
      <div className="text-center text-2xl font-mono mb-6">
        {new Date(seconds * 1000).toISOString().substring(14, 19)}
      </div>

      {/* Mic Indicator */}
      <div className="flex justify-center mb-8">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center
          ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-white/10'}`}
        >
          <Mic className="h-10 w-10" />
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        {!isRecording && !audioUrl && (
          <button
            onClick={startRecording}
            className="px-6 py-2 rounded-full bg-green-500 hover:bg-green-600"
          >
            Start
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="px-6 py-2 rounded-full bg-red-500 hover:bg-red-600"
          >
            Stop
          </button>
        )}
      </div>

      {/* Playback */}
      {audioUrl && (
        <div className="mt-6">
          <audio ref={audioRef} src={audioUrl} controls className="w-full" />

          <div className="mt-4 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-white/10"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function Chats() {
  // State for layout and basic navigation
  const [activeId, setActiveId] = useState(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showTopSearchInput, setShowSearchInput] = useState(false);
  const [showAllOnline, setShowAllOnline] = useState(false);
  const [contactslist, setContactslist] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);

  // State for menus
  //menu for new chat, create group, invite others
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  //menu for chat options like mute, delete, report
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  //menu for attachment options like document, camera, gallery
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('photos');
  //show details for starredMessage,block user,report user and delete chat dialog
  const [showDetails, setShowDetails] = useState(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  const [muted, setMuted] = useState(false);
  //share image
  const [sharedImage, setSharedImage] = useState(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [takePictureMode, setTakePictureMode] = useState(false);
  const [recordAudioMode, setRecordAudioMode] = useState(false);
  
  // Chat Category State
  const [chatCategory, setChatCategory] = useState('direct'); // 'direct' | 'discussion' | 'announcement'
  const [programChats, setProgramChats] = useState([]);
  const [batchChats, setBatchChats] = useState([]);
  const [loading, setLoading] = useState(false);

  const { user, roles: authRoles, token } = useSelector((state) => state.auth || {});
  
  // Check both user.roles (if nested) and authRoles (from slice root)
  const isAdmin = [...(authRoles || []), ...(user?.roles || [])].some(r => {
    const code = typeof r === 'string' ? r : r?.code;
    return ['admin', 'super_admin', 'superadmin', 'administrator'].includes(code?.toLowerCase());
  });

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  };

  // ========== SOCKET.IO REAL-TIME CONNECTION ==========
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Dynamic import of socket.io-client
    import('socket.io-client').then(({ io }) => {
      const serverUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:2707';
      
      const socket = io(serverUrl, {
        auth: { token },
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        console.log('🔌 Socket connected:', socket.id);
      });

      // Listen for real-time messages from OTHER users
      socket.on('new-message', ({ conversationId, message }) => {
        // Skip messages sent by us — we already added them in handleSend
        const senderId = message.senderId?._id || message.senderId;
        const myId = user?.id || user?._id;
        if (senderId === myId) return;

        const formattedMsg = {
          ...message,
          id: message._id,
          isSender: false,
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        };

        // Update whichever list contains this conversation with DE-DUPLICATION
        const updateWithDedupe = (prev) => prev.map(c => {
          if (c._id === conversationId) {
            const alreadyExists = (c.messages || []).some(m => m.id === formattedMsg.id || m._id === formattedMsg.id);
            if (alreadyExists) return c;
            return { ...c, messages: [...(c.messages || []), formattedMsg] };
          }
          return c;
        });

        setProgramChats(updateWithDedupe);
        setBatchChats(updateWithDedupe);
      });



      // Typing indicators
      socket.on('user-typing', ({ userId: typingUserId, conversationId, isTyping }) => {
        // Could be used for UI typing dots in the future
      });

      socket.on('disconnect', () => {
        console.log('🔌 Socket disconnected');
      });

      socketRef.current = socket;
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);
  // ========== END SOCKET.IO ==========

  // ========== UNIFIED DATA FETCHING ==========
  // For Admin: fetch all program/batch chats via admin routes
  // For Everyone: fetch "my chats" via unified route

  const fetchMyChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chats/my-chats`, authHeader);
      const allChats = res.data.data;
      
      // Split into categories
      setProgramChats(allChats.filter(c => c.type === 'PROGRAM_GROUP'));
      setBatchChats(allChats.filter(c => c.type === 'GROUP'));
    } catch (err) {
      console.error('Error fetching my chats:', err);
    } finally {
      setLoading(false);
    }
  };

  // Admin-specific fetchers (kept for admin-only list views with full data)
  const fetchProgramChats = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/chats/programs`, authHeader);
      setProgramChats(res.data.data);
    } catch (err) {
      console.error('Error fetching program chats:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBatchChats = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/admin/chats/batches`, authHeader);
      setBatchChats(res.data.data);
    } catch (err) {
      console.error('Error fetching batch chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    
    if (isAdmin) {
      // Admin sees ALL groups
      if (chatCategory === 'announcement') fetchProgramChats();
      else if (chatCategory === 'discussion') fetchBatchChats();
    } else {
      // Students/Parents see only their enrolled chats
      fetchMyChats();
    }
  }, [chatCategory, token]);

  const handleSyncMembers = async (chatId) => {
    try {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/chats/${chatId}/sync`, {}, authHeader);
        toast.success("Members synced successfully!");
    } catch (err) {
        toast.error("Failed to sync members");
    }
  };

  const handleGlobalSync = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/chats/sync-all`, {}, authHeader);
      toast.success(res.data.message);
      // Refresh current tab data
      if (chatCategory === 'announcement') fetchProgramChats();
      if (chatCategory === 'discussion') fetchBatchChats();
    } catch (err) {
      toast.error("System sync failed");
    } finally {
      setLoading(false);
    }
  };

  const handleInitializeProgramChat = async (programId) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/admin/chats/programs/${programId}/ensure`, {}, authHeader);
      toast.success("Program chat initialized!");
      fetchProgramChats();
    } catch (err) {
      toast.error("Failed to initialize program chat");
    }
  };

  // Messages state
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);
  const rightSideBarRef = useRef();
  const navigator = useNavigate();

  const activeContact = useMemo(() => {
    const fromList = contactslist.find((c) => c.id === activeId);
    if (fromList) return fromList;
    
    const fromPrograms = programChats.find((c) => c._id === activeId);
    if (fromPrograms) {
      return {
        ...fromPrograms,
        id: fromPrograms._id,
        avatar: '/Apen.png',
        messages: fromPrograms.messages || []
      };
    }

    const fromBatches = batchChats.find((c) => c._id === activeId);
    if (fromBatches) {
        return {
          ...fromBatches,
          id: fromBatches._id,
          avatar: '/Apen.png', 
          messages: fromBatches.messages || []
        };
      }
    return null;
  }, [contactslist, programChats, batchChats, activeId]);

  // Fetch messages when activeId changes — uses UNIFIED route
  useEffect(() => {
     const fetchMessages = async () => {
        const isRealId = activeId?.length === 24;
        if (!isRealId) return;

        // Join the socket room for this conversation
        if (socketRef.current) {
          socketRef.current.emit('join-room', activeId);
        }

        try {
           const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/chats/${activeId}/messages`, authHeader);
           
           if (chatCategory === 'announcement') {
              setProgramChats(prev => prev.map(c => 
                 c._id === activeId ? { ...c, messages: res.data.data.reverse() } : c
              ));
           } else if (chatCategory === 'discussion') {
               setBatchChats(prev => prev.map(c => 
                   c._id === activeId ? { ...c, messages: res.data.data.reverse() } : c
                ));
           }
        } catch (err) {
           console.error("Error fetching messages:", err);
        }
     };

     fetchMessages();
  }, [activeId, chatCategory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contactslist, scrollRef]);
  //close right sidebar when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        rightSideBarRef.current &&
        !rightSideBarRef.current.contains(event.target)
      ) {
        setIsContactInfoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [rightSideBarRef]);

  const handleSend = async (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const isRealId = activeId?.length === 24;

    if (isRealId) {
      try {
        // Use UNIFIED route for sending messages
        const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chats/${activeId}/messages`,
        { text: inputText, type: 'text' },
        authHeader
      );

        const newMessage = {
          ...res.data.data,
          id: res.data.data._id,
          isSender: true,
          time: new Date(res.data.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        if (chatCategory === 'announcement') {
          setProgramChats(prev => prev.map(c => 
            c._id === activeId ? { ...c, messages: [...(c.messages || []), newMessage] } : c
          ));
        } else if (chatCategory === 'discussion') {
            setBatchChats(prev => prev.map(c => 
              c._id === activeId ? { ...c, messages: [...(c.messages || []), newMessage] } : c

            ));
          }
        setInputText('');
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to send message");
      }
      return;
    }

    // fallback for mock data
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isSender: true,
      senderName: 'Alex Smith',
      status: 'sent',
    };
    if (replyingTo) {
      newMessage.replyTo = replyingTo;
    }

    // setMessages([...messages, newMessage]);
    setContactslist((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
          };
        }
        return c;
      }),
    );
    setInputText('');
    //close replying to
    setReplyingTo(null);
  };

  const handleReact = (id, emoji) => {
    setContactslist((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: c.messages.map((m) => {
              if (m.id === id) {
                const reactions = [...(m.reactions || [])];
                const idx = reactions.findIndex((r) => r.emoji === emoji);
                if (idx > -1) {
                  reactions[idx] = {
                    ...reactions[idx],
                    count: reactions[idx].count + 1,
                  };
                } else {
                  reactions.push({ emoji, count: 1 });
                }
                return { ...m, reactions };
              }
              return m;
            }),
          };
        }
        return c;
      }),
    );
  };
  // ===========================
  // search friends in sidebar
  // ===========================
  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        const filtered = CONTACTS.filter((c) =>
          c.name.toLowerCase().includes(query.toLowerCase()),
        );
        setContactslist(filtered);
      }, 300),
    [],
  );
  // ===========================
  // search chats in active chat
  // ===========================
  const searchChatDebounce = useMemo(
    () =>
      debounce((query) => {
        const filtered = activeContact.messages.filter((m) =>
          m.text?.toLowerCase().includes(query.toLowerCase()),
        );
        setContactslist((prev) =>
          prev.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                messages: filtered,
              };
            }
            return c;
          }),
        );
      }, 300),
    [activeContact, activeId],
  );
  const searchContactRef = useRef(null);

  //atach global events to close search input when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContactRef.current &&
        !searchContactRef.current.contains(event.target)
      ) {
        setShowSearchInput(false);
        setContactslist(CONTACTS);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [searchContactRef]);

  //============================
  // handle reply to message
  //============================
  const handleReply = (message) => {
    console.log('message to reply:', message);
    setReplyingTo(message);
  };
  //============================
  // starred messages
  //============================
  const handleStarMessage = (messageId) => {
    if (!activeId) return;
    setContactslist((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: (c.messages || []).map((m) => {
              if (m.id === messageId) {
                return { ...m, isStarred: !m.isStarred };
              }
              return m;
            }),
          };
        }
        return c;
      }),
    );
  };

  //============================
  //starred message list
  // ===========================
  const starredMessagesList = useMemo(() => {
    const active = contactslist.find((c) => c.id === activeId);
    if (active) {
      return active.messages.filter((m) => m.isStarred);
    }
    return [];
  }, [contactslist, activeId]);

  const sharedMedia = (label) => {
    if (!activeContact || !activeContact.messages) return [];
    // filter the media with label from messages list
    const filtered = activeContact.messages.filter((m) => {
      if (label === 'photos') return m.type === 'image';
      if (label === 'videos') return m.type === 'video';
      if (label === 'link') return m.type === 'link';
      if (label === 'audio') return m.type === 'audio';
      if (label === 'files') return m.type === 'file';
      return false;
    });
    return filtered;
  };


  //better to memoize each function output
  // const getSharedMedia = useMemo(() => {
  //   return sharedMedia(mediaTab);
  // }, [mediaTab, activeContact]);

  //memoize each function
  const photoMedia = useMemo(() => {
    return sharedMedia('photos');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);
  const videoMedia = useMemo(() => {
    return sharedMedia('videos');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);
  const linkMedia = useMemo(() => {
    return sharedMedia('link');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);
  const audioMedia = useMemo(() => {
    return sharedMedia('audio');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);
  const fileMedia = useMemo(() => {
    return sharedMedia('files');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeContact]);

  const pickAndSendEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
  };

  function pickImage() {
    console.log('picking image');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          setSharedImage(reader.result);
          setShowMediaPreview(true);
        };
        reader.readAsDataURL(file);
      }
    };
    //
  }

  //========================
  //  Media Handler utility functions
  //========================

  const openDocumentHandler = () => {
    console.log('opening document');
  };

  const shareLocationHandler = () => {
    console.log('sharing location');
  };
  const shareContactHandler = () => {
    console.log('sharing contact');
  };
  const handleSendMedia = () => {
    if (!sharedImage) return;
    const newMessage = {
      id: 'mt555',
      text: inputText,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      isSender: true,
      senderName: 'Alex Smith',
      type: 'text',
      reactions: [
        { emoji: '👍', count: 2 },
        { emoji: '❤️', count: 2 },
      ],
      imageUrl: sharedImage,
    };
    setContactslist((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
          };
        }
        return c;
      }),
    );

    setSharedImage(null);
    setShowMediaPreview(false);
    setInputText('');
  };

  //send audio
  const handleSendAudio = (audioUrl, duration) => {
    const newMessage = {
      id: 'mdfd2',
      duration: duration,
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
      isSender: true,
      senderName: 'Alex Smith',
      status: 'read',
      type: 'audio',
      audioUrl: audioUrl,
    };
    setContactslist((prev) =>
      prev.map((c) => {
        if (c.id === activeId) {
          return {
            ...c,
            messages: [...(c.messages || []), newMessage],
          };
        }
        return c;
      }),
    );
  };

  return (
    <div className="flex pt-16 h-screen overflow-hidden font-sans antialiased bg-background text-foreground">
      {/* Sidebar Area */}
      <aside
        className={`${isMobileSidebarOpen ? 'block w-full' : 'hidden'
          } md:block shrink-0 w-full md:w-[350px] border-r flex flex-col z-20`}
      >
        <div className="p-5 flex items-center justify-between">
          {!showTopSearchInput && (
            <h1 className="text-xl font-bold text-foreground">Message</h1>
          )}
          {showTopSearchInput && (
            <motion.input
              // start from end
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                duration: 0.2,
                ease: 'easeInOut',
              }}
              onChange={(e) => debouncedSearch(e.target.value)}
              className="ring-1 ring-gray-500 focus:ring-blue-500 focus:border-none focus:outline-none focus:ring-1 rounded-md px-4 py-1 w-full"
              type="text"
              placeholder="search"
              ref={searchContactRef}
            />
          )}
          <div className="flex items-center gap-2">
            {!showTopSearchInput && isAdmin && (
               <button
                 onClick={handleGlobalSync}
                 className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all border border-primary/20"
                 title="Sync All Chat Groups"
                 disabled={loading}
               >
                 <CheckCheck className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
                 <span className="text-[10px] font-bold uppercase tracking-tight">Sync All</span>
               </button>
            )}
            
            {!showTopSearchInput && !isAdmin && (
              <button
                onClick={() => {
                   if(chatCategory === 'announcement') fetchProgramChats();
                   if(chatCategory === 'discussion') fetchBatchChats();
                }}
                className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            )}


            {!showTopSearchInput && (
              <button
                onClick={() => setShowSearchInput((prev) => !prev)}
                className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
              >
                <Search className="h-5 w-5" />
              </button>
            )}

            <div className="relative">
              <button
                onClick={() => setSidebarMenuOpen(!sidebarMenuOpen)}
                className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              <div className="absolute top-0 right-0 z-50 translate-y-6">
                {sidebarMenuOpen && (
                  <Dropdown
                    onClose={() => setSidebarMenuOpen(false)}
                    items={[
                      {
                        icon: <MessageSquarePlus className="h-4 w-4" />,
                        label: 'New Chat',
                      },
                      {
                        icon: <UserCircle className="h-4 w-4" />,
                        label: 'Create Group',
                      },
                      {
                        icon: <UserPlus className="h-4 w-4" />,
                        label: 'Invite Others',
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="px-5 mb-4">
          <div className="flex bg-muted p-1 rounded-xl gap-1">
            <button
              onClick={() => setChatCategory('direct')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${chatCategory === 'direct' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
            >
              Direct
            </button>
            <button
              onClick={() => setChatCategory('discussion')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${chatCategory === 'discussion' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
            >
              Groups
            </button>
            <button
              onClick={() => setChatCategory('announcement')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${chatCategory === 'announcement' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
            >
              Programs
            </button>
          </div>
        </div>


        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Online Now</h2>
            <button
              onClick={setShowAllOnline.bind(null, (prev) => !prev)}
              className="text-xs font-bold text-primary hover:underline uppercase tracking-wider"
            >
              {showAllOnline ? 'Show Less' : 'View All'}
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {(showAllOnline
              ? contactslist.filter((c) => c.isOnline)
              : contactslist.filter((c) => c.isOnline).slice(0, 3)
            ).map((contact) => (
              <button
                key={contact.id}
                onClick={() => {
                  setActiveId(contact.id);
                  setIsMobileSidebarOpen(false);
                }}
                className="flex flex-col items-center gap-2"
              >
                <Avatar src={contact.avatar} name={contact.name} isOnline={contact.isOnline} />
                <span className="text-xs font-medium text-foreground truncate w-16 text-center">
                  {contact.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 h-full px-2 space-y-6 pb-4 overflow-y-auto custom-scrollbar">
          {chatCategory === 'announcement' || chatCategory === 'discussion' ? (
             <div className="space-y-2">
                 <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sticky top-0 left-0 w-full py-2 bg-background z-50">
                    {chatCategory === 'announcement' ? 'Program Announcements' : 'Batch Discussions'}
                 </h3>
                 {loading ? (
                    <div className="px-4 text-xs text-muted-foreground">Loading groups...</div>
                 ) : (
                    (chatCategory === 'announcement' ? programChats : batchChats).map((chat) => (
                      <button
                        key={chat._id}
                        onClick={() => setActiveId(chat._id)}
                        className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${activeId === chat._id ? 'bg-muted' : 'hover:bg-muted'}`}
                      >
                        <Avatar src={chat.avatar} name={chat.name} size="md" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-sm truncate text-foreground">
                            {chat.name}
                          </h4>
                          <p className="text-[10px] text-muted-foreground">
                            {chat.programId?.title || chat.batchId?.batchName || 'Group Chat'}
                          </p>
                        </div>
                      </button>
                    ))
                 )}
                 {(chatCategory === 'announcement' ? programChats : batchChats).length === 0 && !loading && (
                   <div className="p-8 text-center flex flex-col items-center gap-3">
                      <div className="bg-muted p-3 rounded-full">
                         <MessageSquarePlus className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">
                          {chatCategory === 'announcement' ? 'No program chats found' : 'No group chats found'}
                        </p>
                        <p className="text-[11px] text-muted-foreground mt-1 max-w-[220px] mx-auto">
                           {isAdmin
                             ? (chatCategory === 'announcement' 
                               ? "Click sync to initialize your program channels."
                               : "Batch groups appear once batches are created and synced.")
                             : (chatCategory === 'announcement'
                               ? "Program announcements will appear here once you are enrolled in a program."
                               : "Your batch discussion groups will appear here once you are enrolled.")
                           }
                        </p>
                      </div>
                      {isAdmin && (
                        <button 
                          onClick={handleGlobalSync}
                          className="mt-2 text-[10px] font-bold text-primary border border-primary px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all uppercase tracking-wider"
                        >
                          Initialize All Now
                        </button>
                      )}
                   </div>
                 )}

             </div>
          ) : (
            <>
              <div className="overflow-y-scroll custom-scrollbar h-[30%] relative">
                <h3
                  className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground
                sticky top-0 left-0 w-full py-2 bg-background z-50
                "
                >
                  Pinned Chat
                </h3>
                {contactslist
                  .filter((c) => c.isPinned)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'
                        }`}
                    >
                      <Avatar src={c.avatar} name={c.name} isOnline={c.isOnline} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-sm truncate text-foreground">
                            {c.name}
                          </h4>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {c.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p
                            className={`text-xs truncate ${c.isTyping
                                ? 'text-primary font-semibold'
                                : 'text-muted-foreground'
                              }`}
                          >
                            {c.lastMessage}
                          </p>
                          <div className="flex items-center gap-1.5 ml-2">
                            <Pin className="h-3 w-3 text-muted-foreground" />
                            <CheckCheck className="h-3.5 w-3.5 text-primary" />
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
              </div>

              <div className="overflow-y-scroll custom-scrollbar h-[70%] relative">
                <h3
                  className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground
                sticky top-0 left-0 w-full py-2 bg-background z-50
                "
                >
                  Recent Chat
                </h3>
                {contactslist
                  .filter((c) => !c.isPinned)
                  .map((c) => (
                    <button
                      key={c.id}
                      onClick={() => {
                        setActiveId(c.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left mt-8 ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'
                        }`}
                    >
                      <Avatar src={c.avatar} name={c.name} isOnline={c.isOnline} />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-0.5">
                          <h4 className="font-bold text-sm truncate text-foreground">
                            {c.name}
                          </h4>
                          <span className="text-[10px] font-medium text-muted-foreground">
                            {c.time}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <p className="text-xs truncate text-muted-foreground">
                            {c.lastMessage}
                          </p>
                          {c.unreadCount && (
                            <span className="h-5 min-w-[1.25rem] flex items-center justify-center px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
                              {c.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
              </div>
            </>
          )}

        </div>
      </aside>

      <main
        className={`${!isMobileSidebarOpen ? 'flex' : 'hidden'
          } md:flex flex-col flex-1 relative h-full bg-background`}
      >
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card/10">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
               <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome specifically to your Messaging Hub</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
               Select a conversation from the sidebar to view messages, send files, and manage your program communications.
            </p>
          </div>
        ) : (
          <>
        <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-40">
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className={`${ICON_BTN} md:hidden p-2 -ml-2 rounded-full text-muted-foreground`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar
                src={activeContact?.avatar}
                name={activeContact?.name}
                isOnline={activeContact?.isOnline}
              />
              <div className="min-w-0">
                <h2 className="font-bold text-base truncate">
                  {activeContact?.name}
                </h2>
                <p className="text-[11px] font-medium text-muted-foreground hidden md:block">
                  {activeContact?.isOnline
                    ? 'Active Now'
                    : 'Last seen at 07:15 PM'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => setIsSearchActive(true)}
                className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
              >
                <Search className="h-5 w-5" />
              </button>
              <button
                // route to /video-call
                onClick={() => navigator('./video-call')}
                className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
              >
                <Video className="h-5 w-5" />
              </button>
              <button
                onClick={() =>
                  navigator('./voice-call', {
                    replace: false,
                  })
                }
                className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsContactInfoOpen(!isContactInfoOpen)}
                className={`${ICON_BTN} p-2.5 rounded-xl transition-colors ${isContactInfoOpen ? 'bg-muted text-primary' : ''
                  }`}
              >
                <Info className="h-5 w-5" />
              </button>
              
              {isAdmin && activeId?.length === 24 && (
                <button
                  onClick={() => handleSyncMembers(activeId)}
                  className={`${ICON_BTN} p-2.5 rounded-xl text-primary hover:bg-primary/10`}
                  title="Sync Members (Admin)"
                >
                  <UserPlus className="h-5 w-5" />
                </button>
              )}

              <div className="relative">
                <button
                  onClick={() => setChatMenuOpen(!chatMenuOpen)}
                  className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                <div className="absolute top-0 right-0 z-50 translate-y-6">
                  {chatMenuOpen && (
                    <Dropdown
                      onClose={() => setChatMenuOpen(false)}
                      items={[
                        {
                          icon: <X className="h-4 w-4" />,
                          label: 'Close Chat',
                        },
                        {
                          icon: <Bell className="h-4 w-4" />,
                          label: 'Mute Notification',
                        },
                        {
                          icon: <EyeOff className="h-4 w-4" />,
                          label: 'Disappearing Message',
                        },
                        {
                          icon: <Trash2 className="h-4 w-4" />,
                          label: 'Clear Message',
                        },
                        {
                          icon: <Trash2 className="h-4 w-4 text-red-500" />,
                          label: 'Delete Chat',
                          destructive: true,
                        },
                        { icon: <Flag className="h-4 w-4" />, label: 'Report' },
                        { icon: <UserX className="h-4 w-4" />, label: 'Block' },
                      ]}
                    />
                  )}
                </div>
              </div>
            </div>
        </header>
        {isSearchActive && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="flex items-center  gap-4 animate-in slide-in-from-top duration-200 bg-muted shadow-sm px-6 py-2"
          >
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              onChange={(e) => searchChatDebounce(e.target.value)}
              type="text"
              placeholder="Search Chats"
              className="flex-1 bg-transparent border-none outline-none  px-2 py-1 rounded-2xl text-sm font-medium focus:outline-none"
              ref={searchContactRef}
            />
            <button
              onClick={() => setIsSearchActive(false)}
              className="p-1 hover:bg-muted rounded-full"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </motion.div>
        )}
        {/* Messages List */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-card/50"
        >
          <div className="flex justify-center my-8">
            <span className="px-5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground shadow-sm">
              Today, July 24
            </span>
          </div>
          {activeContact?.messages?.length > 0 ? (
            activeContact.messages.map((m) => (
                <MessageBubble
                  onReply={handleReply}
                  key={m.id}
                  message={m}
                  onOpenContext={() => { }}
                  onReact={handleReact}
                  onStarMessage={handleStarMessage}
                  currentUser={user}
                />
              ))
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 gap-4">
              <MessageCircleX className="w-48 h-48 text-muted-foreground" />

              <h3 className="text-lg font-bold text-foreground">
                No messages yet
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Start a conversation by sending a message to your contact.
              </p>
            </div>
          )}
        </div>
        {/* Input Bar */}
        <div className="border-t border-border bg-card px-5 py-4">
          {activeContact?.type === 'PROGRAM_GROUP' && !isAdmin ? (
            <div className="flex items-center justify-center py-2 px-4 bg-muted/50 rounded-xl border border-dashed border-border text-muted-foreground text-xs font-medium italic">
              <Lock className="w-3 h-3 mr-2" />
              This is a read-only announcement channel.
            </div>
          ) : (
            <>
              {/* Reply preview */}
              {replyingTo && (
                <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/60 px-4 py-2.5">
                  <div className="flex flex-col text-sm">
                    <span className="text-xs font-semibold text-primary">
                      Replying to
                    </span>
                    <span className="truncate text-muted-foreground">
                      {replyingTo.text}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setReplyingTo(null)}
                    className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
                  >
                    ✕
                  </button>
                </div>
              )}

              <form onSubmit={handleSend} className="flex items-end gap-3 relative">
                {/* Attachment button */}
                <button
                  type="button"
                  onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl
                       text-muted-foreground hover:bg-muted transition"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>


            {attachmentMenuOpen && (
              <div className="absolute bottom-full left-0 mb-3">
                <Dropdown
                  onClose={() => setAttachmentMenuOpen(false)}
                  items={[
                    {
                      icon: <FileText className="h-4 w-4 text-blue-500" />,
                      label: 'Document',
                      onClick: () => openDocumentHandler(),
                    },
                    {
                      icon: <Camera className="h-4 w-4 text-red-500" />,
                      label: 'Camera',
                      onClick: () => setTakePictureMode(true),
                    },
                    {
                      icon: <ImageIcon className="h-4 w-4 text-green-500" />,
                      label: 'Gallery',
                      onClick: () => pickImage(),
                    },
                    {
                      icon: <Mic className="h-4 w-4 text-yellow-500" />,
                      label: 'Audio',
                      onClick: () => setRecordAudioMode(true),
                    },
                    {
                      icon: <MapPin className="h-4 w-4 text-purple-500" />,
                      label: 'Location',
                      onClick: () => shareLocationHandler(),
                    },
                    {
                      icon: <User className="h-4 w-4 text-orange-500" />,
                      label: 'Contact',
                      onClick: () => shareContactHandler(),
                    },
                  ]}
                />
              </div>
            )}
            {showReactionPicker && (
              <ReactionPicker
                onClose={() => setShowReactionPicker(false)}
                onReact={pickAndSendEmoji}
              />
            )}
            {/* Emoji */}
            <button
              onClick={() => setShowReactionPicker((prev) => !prev)}
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl
                 text-muted-foreground hover:bg-muted transition cursor-pointer"
            >
              <Smile className="h-5 w-5" />
            </button>

            {/* Mute / Audio */}
            <button
              onClick={() => setMuted((prev) => !prev)}
              type="button"
              className={`flex h-11 w-11 items-center justify-center rounded-xl
                 text-muted-foreground hover:bg-muted transition cursor-pointer
                  ${muted ? 'bg-red-500/10 text-red-500' : ''}
                 `}
            >
              {muted ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Mic className="h-5 w-5" />
              )}
            </button>

            {/* Input */}
            <div className="relative flex-1">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type a message…"
                className="h-11 w-full rounded-xl bg-muted px-5 text-sm
                   placeholder:text-muted-foreground
                   focus:outline-none focus:ring-2 focus:ring-primary/60
                   transition"
              />
            </div>

            {/* Send */}
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-11 w-11 items-center justify-center rounded-xl
                 bg-primary text-primary-foreground shadow-md
                 hover:bg-primary/90 disabled:opacity-50
                 transition active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          </>
        )}
        </div>
        </>
      )}
      </main>




      {/* Right Sidebar - Contact Info */}
      {isContactInfoOpen && (
        <motion.aside
          ref={rightSideBarRef}
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="fixed inset-0 md:relative md:inset-auto shrink-0 w-full md:w-[320px] bg-card border-l border-border flex flex-col z-30"
        >
          <div className="p-5 flex items-center justify-between border-b border-border">
            <h2 className="text-base font-bold text-foreground">
              Contact Info
            </h2>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-warning cursor-pointer" />
              <Trash2 className="h-5 w-5 text-error cursor-pointer" />
              <button
                onClick={() => setIsContactInfoOpen(false)}
                className="p-2 hover:bg-muted rounded-full"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="p-8 flex flex-col items-center text-center">
              <Avatar src={activeContact?.avatar} name={activeContact?.name} size="xl" />
              <h3 className="mt-5 text-xl font-bold text-foreground">
                {activeContact?.name}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Last seen at 07:15 PM
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <Phone className="" />
                </button>
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <Video className="h-full w-full" />
                </button>
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <MessageSquarePlus className="h-full w-full" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeContact?.bio || 'No bio available'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Phone
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact?.phone || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact?.email || 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            <div className="border-t border-border mt-4">
              <div className="p-5 flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">
                  Shared Media
                </h4>
                <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
                  View All
                </button>
              </div>
              <div className="px-5 pb-6">
                <div className="flex gap-2 mb-6">
                  {['photos', 'videos', 'file', 'link'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setMediaTab(tab)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${mediaTab === tab
                          ? 'bg-primary text-primary-foreground shadow-md'
                          : 'text-muted-foreground hover:bg-muted'
                        }`}
                    >
                      {tab === 'photos'
                        ? 'Photos'
                        : tab === 'videos'
                          ? 'Videos'
                          : tab === 'file'
                            ? 'File'
                            : 'Link'}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {mediaTab === 'photos' &&
                    photoMedia.map((p, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-muted overflow-hidden border border-border"
                      >
                        <img
                          src={
                            p?.url ||
                            `/ceholder-svg-key-e179v-height-100-width-100-text-.jpg?key=e179v&height=100&width=100&text=${i + 1}`
                          }
                          className="w-full h-full object-cover"
                          alt="media"
                        />
                      </div>
                    ))}
                  {mediaTab === 'videos' &&
                    videoMedia.map((v, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl bg-muted overflow-hidden border border-border group cursor-pointer"
                      >
                        <img
                          src={
                            v?.thumbnail ||
                            `/ceholder-svg-key-e179v-height-100-width-100-text-.jpg?key=e179v&height=100&width=100&text=${i + 1}`
                          }
                          className="w-full h-full object-cover"
                          alt="video"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                      </div>
                    ))}
                </div>

                {mediaTab === 'file' && (
                  <div className="space-y-4">
                    {fileMedia.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {f.fileName}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              {f.date} <span className="mx-1">|</span>{' '}
                              {f?.fileSize}
                            </p>
                          </div>
                        </div>
                        <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                          <Send className="h-4 w-4 rotate-90" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {mediaTab === 'link' && (
                  <div className="space-y-4">
                    {linkMedia.map((l, i) => (
                      <a
                        key={i}
                        href={l.linkPreview.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                      >
                        {!l.linkPreview.image && (
                          <div className="h-32 w-full bg-muted flex items-center justify-center">
                            <Link2 className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        {l.linkPreview.image && (
                          <img
                            src={l.linkPreview.image}
                            alt="link preview"
                            className="w-full h-32 object-cover"
                          />
                        )}

                        <div className="p-3">
                          <h5 className="text-sm font-bold text-foreground mb-1 truncate">
                            {l.linkPreview.title}
                          </h5>
                          <p className="text-xs text-muted-foreground truncate">
                            {l.linkPreview.description}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border hover:bg-muted transition-colors cursor-pointer">
              <div className="p-2 space-y-1">
                {[
                  {
                    icon: <Star className="h-4 w-4" />,
                    label: 'Starred Messages',
                    badge: starredMessagesList.length,
                  },
                  {
                    icon: <VolumeX className="h-4 w-4" />,
                    label: 'Mute Notifications',
                  },
                  { icon: <UserX className="h-4 w-4" />, label: 'Block User' },
                  { icon: <Flag className="h-4 w-4" />, label: 'Report User' },
                  {
                    icon: <Trash2 className="h-4 w-4" />,
                    label: 'Delete Chat',
                  },
                ].map((item, i) => (
                  <>
                    <button
                      onClick={() =>
                        setShowDetails(
                          showDetails === item.label ? null : item.label,
                        )
                      }
                      key={i}
                      className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-muted-foreground">
                          {item.icon}
                        </span>
                        <span className="text-sm font-bold text-foreground">
                          {item.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <span className="h-5 min-w-[1.25rem] flex items-center justify-center px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                            {item.badge}
                          </span>
                        )}
                        {showDetails === item.label ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </button>
                    {showDetails === item.label &&
                      item.label === 'Starred Messages' && (
                        <div className="mt-2 p-4 border border-border rounded-xl bg-muted/50">
                          <h4 className="text-sm font-bold text-foreground mb-3">
                            Starred Messages
                          </h4>
                          {starredMessagesList.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              No starred messages.
                            </p>
                          ) : (
                            <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                              {starredMessagesList.map((msg) => (
                                <div
                                  key={msg.id}
                                  className="p-3 bg-muted rounded-lg border border-border"
                                >
                                  {msg.type === 'text' ? (
                                    <p className="text-sm text-foreground">
                                      {msg.text}
                                    </p>
                                  ) : msg.type === 'image' ? (
                                    <img
                                      src={msg.imageUrl}
                                      alt="starred"
                                      className="max-w-full h-auto rounded-md"
                                    />
                                  ) : msg.type === 'file' ? (
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-foreground truncate">
                                          {msg.fileName}
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                          {msg.fileSize}
                                        </p>
                                      </div>
                                    </div>
                                  ) : msg.type === 'video' ? (
                                    <div className="relative">
                                      <img
                                        src={msg.videoThumbnail}
                                        alt="starred video"
                                        className="max-w-full h-auto rounded-md"
                                      />
                                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                        <Play className="h-6 w-6 text-white fill-white" />
                                      </div>
                                    </div>
                                  ) : msg.type === 'audio' ? (
                                    <div className="flex items-center gap-3">
                                      <div className="h-8 w-8 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
                                        <Mic className="h-5 w-5 text-muted-foreground" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-foreground truncate">
                                          Audio Message
                                        </p>
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                          {msg.duration}
                                        </p>
                                      </div>
                                    </div>
                                  ) : msg.type === 'link' ? (
                                    <a
                                      href={msg.linkPreview.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="block border border-border rounded-lg overflow-hidden"
                                    >
                                      <img
                                        src={msg.linkPreview.image}
                                        alt="link preview"
                                        className="w-full h-24 object-cover"
                                      />
                                      <div className="p-3 bg-muted">
                                        <p className="text-sm font-bold text-foreground truncate">
                                          {msg.linkPreview.url}
                                        </p>
                                      </div>
                                    </a>
                                  ) : null}

                                  <span className="text-[10px] text-muted-foreground">
                                    {msg.time}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                  </>
                ))}
              </div>
            </div>
          </div>
        </motion.aside>
      )}

      {/* showMediaPreview */}
      {showMediaPreview && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 w-full max-w-md">
            <img
              className="w-full h-auto rounded-md mb-4"
              src={sharedImage}
              alt="Preview"
            />
            <label
              className="text-sm font-medium text-foreground"
              htmlFor="caption"
            >
              caption
            </label>
            <input
              type="text"
              id="caption"
              className="w-full border border-gray-300 rounded-md p-2 mt-2"
              placeholder="Add a caption..."
              onChange={(e) => setInputText(e.target.value)}
            />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowMediaPreview(false);
                  setSharedImage(null);
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Logic to send the image with caption
                  handleSendMedia(sharedImage);
                  setShowMediaPreview(false);
                  setSharedImage(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
      {/* take picture mode */}
      {takePictureMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-xl mx-auto mt-20 h-96">
            <CameraComponent
              onCapture={(imageData) => {
                setTakePictureMode(false);
                setSharedImage(imageData);
                setShowMediaPreview(true);
              }}
              onClose={() => setTakePictureMode(false)}
            />
          </div>
        </div>
      )}
      {/* record audio mode */}
      {recordAudioMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-auto mt-20 shadow-lg shadow-amber-300/20">
            <AudioRecorder
              onSave={(audioData, duration) => {
                setRecordAudioMode(false);
                handleSendAudio(audioData, duration);
              }}
              onClose={() => setRecordAudioMode(false)}
            />
          </div>
        </div>
      )}

      {/* Global CSS for scrollbars */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--muted);
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

    </div>
  );
}
