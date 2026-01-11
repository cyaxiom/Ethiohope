'use client';
import './Temp.jsx';
import React from 'react';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';

import { useState, useRef, useEffect } from 'react';
import { DS } from '@/constants/designSystem.js';
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
} from 'lucide-react';

// --- Mock Data ---
const CONTACTS = [
  {
    id: '1',
    name: 'Mark Villiams',
    avatar: '/LittleCoder1.png',
    lastMessage: 'Have you called them?',
    time: '10:20 PM',
    isOnline: true,
    isPinned: true,
    bio: 'Product Designer | Tech Enthusiast',
    phone: '555-555-21541',
    email: 'info@example.com',
  },
  {
    id: '2',
    name: 'Elizabeth Sosa',
    avatar: '/heroimgKids.png',
    lastMessage: 'Typing...',
    time: 'Yesterday',
    isOnline: false,
    isPinned: true,
    isTyping: true,
  },
  {
    id: '3',
    name: 'Michael Howard',
    avatar: '/LittleCoder1.png',
    lastMessage: 'Thank you',
    time: '10:20 PM',
    isOnline: true,
    isPinned: true,
  },
  {
    id: '4',
    name: 'Horace Keene',
    avatar: '/LittleCoder1.png',
    lastMessage: 'Have you called them?',
    time: 'Just Now',
    isOnline: true,
    isPinned: false,
    unreadCount: 11,
  },
  {
    id: '5',
    name: 'Hollis Tran',
    avatar: '/LittleCoder1.png',
    lastMessage: 'Video call ended',
    time: 'Yesterday',
    isOnline: true,
    isPinned: false,
    isVideoCall: true,
  },
];

const INITIAL_MESSAGES = [
  {
    id: 'm1',
    text: 'Hello @Alex Thank you for the beautiful web design ahead schedule.',
    time: '8:16 PM',
    isSender: false,
    senderName: 'Mark Villiams',
  },
  {
    id: 'm2',
    type: 'audio',
    duration: '0:05',
    time: '8:16 PM',
    isSender: true,
    senderName: 'Alex Smith',
    status: 'read',
  },
  {
    id: 'm3',
    type: 'link',
    text: 'https://www.youtube.com/watch?v=GCmL3mS0Psk',
    linkPreview: {
      url: 'https://www.youtube.com/watch?v=GCmL3mS0Psk',
      image: '/LittleCoder1.png',
    },
    time: '8:16 PM',
    isSender: false,
    senderName: 'Mark Villiams',
    isStarred: true,
  },
  {
    id: 'm4',
    text: 'Please check and review the files 😊',
    time: '8:16 PM',
    isSender: false,
    senderName: 'Mark Villiams',
    reactions: [
      { emoji: '👍', count: 2 },
      { emoji: '❤️', count: 2 },
    ],
  },
  {
    id: 'm5',
    type: 'file',
    fileName: 'Landing_page_V1.doc',
    fileSize: '80 Bytes',
    time: '8:16 PM',
    isSender: false,
    senderName: 'Mark Villiams',
  },
  {
    id: 'm6',
    text: 'Thank you for your support',
    time: '8:16 PM',
    isSender: false,
    senderName: 'Mark Villiams',
  },
];

// --- Components ---

const Avatar = ({ src, isOnline, size = 'md' }) => {
  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-24 w-24',
  };
  return (
    <div className={`relative flex-shrink-0 ${sizes[size]}`}>
      <img
        src={src || '/Apen.png'}
        alt="avatar"
        className="rounded-full object-cover h-full w-full bg-muted"
      />
      {isOnline && (
        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-card bg-success" />
      )}
    </div>
  );
};

const Dropdown = ({ items, onClose, width = 'w-56' }) => (
  <>
    {/* backdrop */}
    <div className="fixed inset-0 z-40" onClick={onClose} />

    {/* dropdown itself */}
    <div
      className={`${width} bg-card border border-border rounded-xl shadow-xl z-50 p-1 py-2
      animate-in fade-in zoom-in duration-150 text-foreground`}
    >
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => {
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
  </>
);

const ReactionPicker = ({ onReact, onClose }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '🙏', '➕'];
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-full shadow-lg p-1.5 flex gap-1 animate-in slide-in-from-bottom-2 duration-200 z-50">
        {emojis.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onReact(emoji)}
            className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full text-lg transition-transform hover:scale-125"
          >
            {emoji === '➕' ? (
              <span className="text-primary text-xl font-bold">+</span>
            ) : (
              emoji
            )}
          </button>
        ))}
      </div>
    </>
  );
};
//onOpenContext is not used currently but can be used to open context menu on message
const MessageBubble = ({ message, onOpenContext, onReact }) => {
  const isSender = message.isSender;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className={`flex flex-col mb-6 ${isSender ? 'items-end' : 'items-start'}`}
    >
      <div
        className={`flex items-center gap-2 mb-1 group ${
          isSender ? 'flex-row-reverse' : ''
        }`}
      >
        <span className="text-xs font-semibold text-card-foreground">
          {message.senderName}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {message.time}
        </span>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-1 hover:bg-muted rounded-full transition-opacity opacity-0 group-hover:opacity-100"
          >
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </button>
          {isMenuOpen && (
            <div className="absolute top-0 left-0 z-50 translate-y-6">
              <Dropdown
                width="w-48"
                onClose={() => setIsMenuOpen(false)}
                items={[
                  { icon: <Info className="h-4 w-4" />, label: 'Message Info' },
                  { icon: <Reply className="h-4 w-4" />, label: 'Reply' },
                  {
                    icon: <Smile className="h-4 w-4" />,
                    label: 'React',
                    onClick: () => {
                      setShowReactions(true);
                      setIsMenuOpen(false);
                    },
                  },
                  { icon: <Forward className="h-4 w-4" />, label: 'Forward' },
                  { icon: <Star className="h-4 w-4" />, label: 'Star Message' },
                  { icon: <Flag className="h-4 w-4" />, label: 'Report' },
                  {
                    icon: <Trash2 className="h-4 w-4 text-red-500" />,
                    label: 'Delete',
                    destructive: true,
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
      {/*  */}
      <div
        className={`flex gap-3 max-w-[85%] group relative ${
          isSender ? 'flex-row-reverse' : ''
        }`}
      >
        {!isSender && <Avatar src="/placeholder.png" size="md" />}
        <div className="flex flex-col gap-1 relative">
          <div
            className={`relative p-3 rounded-2xl ${
              isSender
                ? 'bg-primary text-primary-foreground rounded-tr-none shadow-md'
                : 'bg-card text-card-foreground rounded-tl-none border border-border shadow-sm'
            }`}
          >
            {showReactions && (
              <ReactionPicker
                onClose={() => setShowReactions(false)}
                onReact={(e) => onReact(message.id, e)}
              />
            )}

            {message.type === 'audio' ? (
              <div className="flex items-center gap-3 min-w-[220px]">
                <button className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg">
                  <Play className="h-5 w-5 text-white fill-white" />
                </button>
                <div className="flex-1 h-6 flex items-center gap-0.5">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="w-0.5 rounded-full bg-warning"
                      style={{ height: `${20 + Math.random() * 80}%` }}
                    />
                  ))}
                </div>
                <span
                  className={`text-xs font-semibold ${
                    isSender
                      ? 'text-primary-foreground'
                      : 'text-card-foreground'
                  }`}
                >
                  {message.duration}
                </span>
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
            ) : (
              <p className="text-sm leading-relaxed text-card-foreground">
                {message.text}
              </p>
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
        {isSender && <Avatar src="/placeholder.png" size="md" />}
      </div>
    </div>
  );
};

// --- Main App ---

export default function Chats() {
  // State for layout and basic navigation
  const [activeId, setActiveId] = useState('1');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  // State for menus
  //menu for new chat, create group, invite others
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  //menu for chat options like mute, delete, report
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  //menu for attachment options like document, camera, gallery
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('photos');

  // Messages state
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const activeContact = CONTACTS.find((c) => c.id === activeId) || CONTACTS[0];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, scrollRef]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

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
    setMessages([...messages, newMessage]);
    setInputText('');
  };

  const handleReact = (id, emoji) => {
    setMessages((prev) =>
      prev.map((m) => {
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
      })
    );
  };
  return (
    <div className="flex h-screen overflow-hidden font-sans antialiased bg-background text-foreground">
      {/* Sidebar Area */}
      <aside
        className={`${
          isMobileSidebarOpen ? 'block w-full' : 'hidden'
        } md:block shrink-0 w-full md:w-[350px] border-r flex flex-col z-20`}
      >
        <div className="p-5 flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">All Chats</h1>
          <div className="flex items-center gap-2">
            <button
              className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
            >
              <Search className="h-5 w-5" />
            </button>
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

        <div className="px-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-foreground">Online Now</h2>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
              View All
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-1">
            {CONTACTS.map((c) => (
              <Avatar
                key={c.id}
                src={c.avatar}
                isOnline={c.isOnline}
                size="lg"
              />
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-4 custom-scrollbar">
          <div>
            <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Pinned Chat
            </h3>
            {CONTACTS.filter((c) => c.isPinned).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${
                  activeId === c.id ? 'bg-muted' : 'hover:bg-muted'
                }`}
              >
                <Avatar src={c.avatar} isOnline={c.isOnline} />
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
                      className={`text-xs truncate ${
                        c.isTyping
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

          <div>
            <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Recent Chat
            </h3>
            {CONTACTS.filter((c) => !c.isPinned).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setActiveId(c.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${
                  activeId === c.id ? 'bg-muted' : 'hover:bg-muted'
                }`}
              >
                <Avatar src={c.avatar} isOnline={c.isOnline} />
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
        </div>
      </aside>

      {/* Main Conversation Area */}
      <main
        className={`${
          !isMobileSidebarOpen ? 'flex' : 'hidden'
        } md:flex flex-1 flex-col h-full bg-muted overflow-hidden`}
      >
        {/* Chat Header */}
        <header className="px-6 py-4  bg-car border-b border-border flex items-center justify-between z-10">
          <>
            <div className="flex items-center gap-4 min-w-0">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className={`${ICON_BTN} md:hidden p-2 -ml-2 rounded-full text-muted-foreground`}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <Avatar
                src={activeContact.avatar}
                isOnline={activeContact.isOnline}
              />
              <div className="min-w-0">
                <h2 className="font-bold text-base truncate">
                  {activeContact.name}
                </h2>
                <p className="text-[11px] font-medium text-muted-foreground">
                  {activeContact.isOnline
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
                className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
              >
                <Video className="h-5 w-5" />
              </button>
              <button
                className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
              >
                <Phone className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsContactInfoOpen(!isContactInfoOpen)}
                className={`${ICON_BTN} p-2.5 rounded-xl transition-colors ${
                  isContactInfoOpen ? 'bg-muted text-primary' : ''
                }`}
              >
                <Info className="h-5 w-5" />
              </button>
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
          </>
        </header>
        {isSearchActive && (
          <div className="flex items-center gap-4 animate-in slide-in-from-top duration-200 bg-muted shadow-sm px-6 py-2">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search Chats"
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium focus:outline-none"
            />
            <button
              onClick={() => setIsSearchActive(false)}
              className="p-1 hover:bg-muted rounded-full"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>
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
          {messages.map((m) => (
            <MessageBubble
              key={m.id}
              message={m}
              onOpenContext={() => {}}
              onReact={handleReact}
            />
          ))}
        </div>
        {/* Input Bar */}
        <div className="p-6 bg-card border-t border-border">
          <form onSubmit={handleSend} className="flex items-center gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
                className={`${ICON_BTN_MD} p-3 rounded-xl text-muted-foreground`}
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {attachmentMenuOpen && (
                <div className="absolute bottom-full mb-4 left-0">
                  <Dropdown
                    position="left"
                    onClose={() => setAttachmentMenuOpen(false)}
                    items={[
                      {
                        icon: <FileText className="h-4 w-4 text-blue-500" />,
                        label: 'Document',
                      },
                      {
                        icon: <Camera className="h-4 w-4 text-red-500" />,
                        label: 'Camera',
                      },
                      {
                        icon: <ImageIcon className="h-4 w-4 text-green-500" />,
                        label: 'Gallery',
                      },
                      {
                        icon: <Mic className="h-4 w-4 text-yellow-500" />,
                        label: 'Audio',
                      },
                      {
                        icon: <MapPin className="h-4 w-4 text-purple-500" />,
                        label: 'Location',
                      },
                      {
                        icon: <User className="h-4 w-4 text-orange-500" />,
                        label: 'Contact',
                      },
                    ]}
                  />
                </div>
              )}
            </div>
            <button
              type="button"
              className={`${ICON_BTN_MD} p-3 rounded-xl text-muted-foreground`}
            >
              <Smile className="h-5 w-5" />
            </button>
            <button
              type="button"
              className={`${ICON_BTN_MD} p-3 rounded-xl text-muted-foreground`}
            >
              <VolumeX className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message here..."
              className="flex-1 bg-muted border-none outline-none py-3.5 px-6 rounded-xl text-sm font-medium placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-3.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all shadow-lg"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </main>

      {/* Right Sidebar - Contact Info */}
      {isContactInfoOpen && (
        <aside className="fixed inset-0 md:relative md:inset-auto shrink-0 w-full md:w-[320px] bg-card border-l border-border flex flex-col z-30 animate-in slide-in-from-right duration-300">
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
              <Avatar src={activeContact.avatar} size="xl" />
              <h3 className="mt-5 text-xl font-bold text-foreground">
                {activeContact.name}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mt-1">
                Last seen at 07:15 PM
              </p>

              <div className="flex gap-3 mt-6">
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <Phone className="h-4 w-4" />
                </button>
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <Video className="h-4 w-4" />
                </button>
                <button
                  className={`${PRIMARY_ICON_BTN} h-10 w-10 rounded-full`}
                >
                  <MessageSquarePlus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-6 py-4 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeContact.bio || 'No bio available'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Phone
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact.phone || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    Email Address
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact.email || 'Not set'}
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
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${
                        mediaTab === tab
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
                    [...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square rounded-xl bg-muted overflow-hidden border border-border"
                      >
                        <img
                          src={`/ceholder-svg-key-e179v-height-100-width-100-text-.jpg?key=e179v&height=100&width=100&text=${
                            i + 1
                          }`}
                          className="w-full h-full object-cover"
                          alt="media"
                        />
                      </div>
                    ))}
                  {mediaTab === 'videos' &&
                    [...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className="relative aspect-square rounded-xl bg-muted overflow-hidden border border-border group cursor-pointer"
                      >
                        <img
                          src={`/ceholder-svg-key-ho6dp-height-100-width-100-text-v.jpg?key=ho6dp&height=100&width=100&text=V${
                            i + 1
                          }`}
                          className="w-full h-full object-cover"
                          alt="video"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Play className="h-6 w-6 text-white fill-white" />
                        </div>
                        {i === 4 && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-bold">
                            +10
                          </div>
                        )}
                      </div>
                    ))}
                </div>

                {mediaTab === 'file' && (
                  <div className="space-y-4">
                    {[
                      {
                        name: 'Landing_page_V1.doc',
                        date: '12 Mar 2023',
                        size: '246.3 KB',
                      },
                      {
                        name: 'Design Guideless.pdf',
                        date: '12 Mar 2023',
                        size: '246.3 KB',
                      },
                      {
                        name: 'sample site.txt',
                        date: '12 Mar 2023',
                        size: '246.3 KB',
                      },
                    ].map((f, i) => (
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
                              {f.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                              {f.date} <span className="mx-1">|</span> {f.size}
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
                    {[
                      {
                        name: 'Digital Marketing Guide',
                        url: 'https://elements.envato.com/all-items/blog',
                      },
                      {
                        name: 'Blog Post',
                        url: 'https://elements.envato.com/blog-post-TXQ5FB8',
                      },
                    ].map((l, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="h-12 w-12 shrink-0 rounded-xl bg-muted flex items-center justify-center border border-border">
                          <Info className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-foreground truncate">
                            {l.name}
                          </p>
                          <p className="text-xs text-primary truncate hover:underline cursor-pointer">
                            {l.url}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-border">
              <div className="p-2 space-y-1">
                {[
                  {
                    icon: <Star className="h-4 w-4" />,
                    label: 'Starred Messages',
                    badge: 10,
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
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-muted-foreground">{item.icon}</span>
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
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Global CSS for scrollbars */}
      <style jsx global>{`
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
      `}</style>
    </div>
  );
}
