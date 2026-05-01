'use client';
import React, { useMemo, useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, X, Send, Search, ShieldOff } from 'lucide-react';

import { debounce } from '../../lib/utils';
import { ThemeToggle } from '@components/ThemeToggle/ThemeToggle';

// Imported Components
import Avatar from '@/components/Chat/Avatar';
import CameraComponent from '@/components/Chat/CameraComponent';
import AudioRecorder from '@/components/Chat/AudioRecorder';
import ChatSidebar from '@/components/Chat/ChatSidebar';
import ChatHeader from '@/components/Chat/ChatHeader';
import MessageList from '@/components/Chat/MessageList';
import MessageInput from '@/components/Chat/MessageInput';
import ChatInfoPanel from '@/components/Chat/ChatInfoPanel';

// Placeholder for CONTACTS if not found (though it should be here)
const CONTACTS: any[] = []; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export default function Chats() {
  // State for layout and basic navigation
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(true);
  const [isContactInfoOpen, setIsContactInfoOpen] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [showTopSearchInput, setShowSearchInput] = useState(false);
  const [showAllOnline, setShowAllOnline] = useState(false);
  const [contactslist, setContactslist] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<any>(null);
  const [editingMessage, setEditingMessage] = useState<any>(null);

  // State for menus
  const [sidebarMenuOpen, setSidebarMenuOpen] = useState(false);
  const [chatMenuOpen, setChatMenuOpen] = useState(false);
  const [attachmentMenuOpen, setAttachmentMenuOpen] = useState(false);
  const [mediaTab, setMediaTab] = useState('photos');
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [showReactionPicker, setShowReactionPicker] = useState(false);
  
  // Media states
  const [sharedImage, setSharedImage] = useState<any>(null);
  const [showMediaPreview, setShowMediaPreview] = useState(false);
  const [takePictureMode, setTakePictureMode] = useState(false);
  const [recordAudioMode, setRecordAudioMode] = useState(false);
  
  // Chat Category State
  const [chatCategory, setChatCategory] = useState<'direct' | 'discussion' | 'announcement'>('direct');
  const [programChats, setProgramChats] = useState<any[]>([]);
  const [batchChats, setBatchChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [isDirectChatEnabled, setIsDirectChatEnabled] = useState(true);
  const [isGroupChatEnabled, setIsGroupChatEnabled] = useState(true);

  const { user, roles: authRoles, permissions: authPermissions, token } = useSelector((state: any) => state.auth || {});
  
  const isAdmin = [...(authRoles || []), ...(user?.roles || [])].some(r => {
    const code = typeof r === 'string' ? r : r?.code;
    return ['admin', 'super_admin', 'superadmin', 'administrator'].includes(code?.toLowerCase());
  });
  const isParent = [...(authRoles || []), ...(user?.roles || [])].some(r => {
    const code = typeof r === 'string' ? r : r?.code;
    return code?.toLowerCase() === 'parent';
  });

  // Detect if current user is a child/student (not staff)
  const isChild = user?.type === 'child' || [...(authRoles || [])].some(r => {
    const code = typeof r === 'string' ? r : r?.code;
    return code?.toLowerCase() === 'child';
  });

  // Only use authPermissions from the login response — don't merge user object
  // properties which may contain stale or unintended data
  const allPermissions = [...(authPermissions || [])];

  const hasBroadcastPermission = isAdmin || allPermissions.some(p => {
    const key = typeof p === 'string' ? p : p?.key;
    return key === 'chat.broadcast';
  });

  const hasWritePermission = isAdmin || allPermissions.some(p => {
    const key = typeof p === 'string' ? p : p?.key;
    return key === 'chat.write';
  });

  // Check if user has the explicit chat.direct.start permission from their role
  const hasDirectStartPermission = allPermissions.some(p => {
    const key = typeof p === 'string' ? p : p?.key;
    return key === 'chat.direct.start';
  });
  const hasDirectTogglePermission = allPermissions.some(p => {
    const key = typeof p === 'string' ? p : p?.key;
    return key === 'chat.direct.toggle' || key === 'chat.manage';
  });
  const hasGroupTogglePermission = allPermissions.some(p => {
    const key = typeof p === 'string' ? p : p?.key;
    return key === 'chat.group.toggle' || key === 'chat.manage';
  });
  // Admins always can start direct chats; others need the explicit permission
  const canStartDirectChat = isAdmin || hasDirectStartPermission;

  // Debug: log permission state so issues can be diagnosed
  // console.log('🔑 Chat permissions debug:', { isAdmin, isChild, hasDirectStartPermission, canStartDirectChat, allPermissions });

  const authHeader = {
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true
  };

  const chatPermissions = {
    canWrite: hasWritePermission,
    canReply: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.reply'),
    canReact: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.react'),
    canDeleteOwn: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.delete.own'),
    canDeleteAll: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.delete.all'),
    canEditOwn: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.edit.own'),
    canEditAll: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.edit.all'),
    canReport: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.read'),
    canForward: isAdmin || allPermissions.some(p => (typeof p === 'string' ? p : p?.key) === 'chat.read'),
  };

  const socketRef = useRef<any>(null);

  useEffect(() => {
    if (!token) return;

    import('socket.io-client').then(({ io }) => {
      const serverUrl = API_BASE_URL.replace('/api/v1', '');

      const socket = io(serverUrl, {
        auth: { token },
        withCredentials: true,
        transports: ['websocket', 'polling'],
      });

      socket.on('connect', () => {
        // console.log('🔌 Socket connected:', socket.id)
      });

      socket.on('new-message', ({ conversationId, message }: any) => {
        const senderId = (message.senderId?._id || message.senderId || message.childId?._id || message.childId || '').toString();
        const myId = (user?.id || user?._id || user?.attributes?.id || '').toString();
        
        /*
        console.log('📩 Real-time Message:', { 
          conversationId, 
          msgId: message._id, 
          senderId, 
          myId, 
          isMe: senderId === myId 
        });
        */

        // Don't duplicate our own sent messages (handled by handleSend)
        if (senderId === myId) return;

        const formattedMsg = {
          ...message,
          id: message._id,
          isSender: false,
          time: new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        };

        const updateWithDedupe = (prev: any[]) => prev.map(c => {
          if (c._id === conversationId || c.id === conversationId) {
            // console.log('✨ Updating history for chat:', c.name || conversationId);
            const currentMessages = c.messages || [];
            const alreadyExists = currentMessages.some((m: any) => m.id === formattedMsg.id || m._id === formattedMsg.id);
            if (alreadyExists) return c;

            // If this chat is NOT currently active, increment its local unread count
            const isChatActive = (activeId === conversationId);
            if (isChatActive) {
               // Auto-mark as read since we are looking at it
               axios.post(`${API_BASE_URL}/chats/${conversationId}/read`, {}, authHeader)
                .then(() => window.dispatchEvent(new CustomEvent('chat-notification-update')))
                .catch(err => console.error("Error auto-marking read:", err));
            } else {
               window.dispatchEvent(new CustomEvent('chat-notification-update'));
            }

            return { 
              ...c, 
              messages: [...currentMessages, formattedMsg],
              unreadCount: isChatActive ? 0 : (c.unreadCount || 0) + 1,
              lastMessage: formattedMsg.text || (formattedMsg.type === 'image' ? '📷 Image' : formattedMsg.type === 'file' ? '📄 File' : '🎤 Audio'),
              time: formattedMsg.time,
              isSenderLast: false,
              isSeenLast: false
            };
          }
          return c;
        });

        setProgramChats(updateWithDedupe);
        setBatchChats(updateWithDedupe);
        setContactslist(updateWithDedupe);
      });

      socket.on('message-updated', ({ conversationId, message }: any) => {
        const update = (prev: any[]) => prev.map(c => {
          if (c._id === conversationId || c.id === conversationId) {
            return {
              ...c,
              messages: (c.messages || []).map((m: any) => 
                (m._id === message._id || m.id === message._id) ? { ...message, id: message._id, isSender: (message.senderId?._id || message.senderId) === (user?.id || user?._id) } : m
              )
            };
          }
          return c;
        });
        setProgramChats(update);
        setBatchChats(update);
        setContactslist(update);
      });

      socket.on('message-deleted', ({ conversationId, messageId }: any) => {
        const update = (prev: any[]) => prev.map(c => {
          if (c._id === conversationId || c.id === conversationId) {
            return {
              ...c,
              messages: (c.messages || []).filter((m: any) => m._id !== messageId && m.id !== messageId)
            };
          }
          return c;
        });
        setProgramChats(update);
        setBatchChats(update);
        setContactslist(update);
      });

      socket.on('messages-read', ({ conversationId, readerId }: any) => {
        const myId = (user?.id || user?._id || '').toString();
        if (readerId === myId) return;

        const update = (prev: any[]) => prev.map(c => {
          if (c._id === conversationId || c.id === conversationId) {
            return {
              ...c,
              messages: (c.messages || []).map((m: any) => {
                 const senderId = (m.senderId?._id || m.senderId || m.childId?._id || m.childId || '').toString();
                 if (senderId === readerId) return m;
                 
                 const currentIsReadBy = m.isReadBy || [];
                 if (!currentIsReadBy.includes(readerId)) {
                   return { ...m, isReadBy: [...currentIsReadBy, readerId] };
                 }
                 return m;
              }),
              isSeenLast: true
            };
          }
          return c;
        });
        setProgramChats(update);
        setBatchChats(update);
        setContactslist(update);
        window.dispatchEvent(new CustomEvent('chat-notification-update'));
      });

      socket.on('user-presence', ({ userId, isOnline, lastSeen }: any) => {
        const myId = (user?.id || user?._id || '').toString();
        if (userId === myId) return;

        // console.log('👤 Presence Update:', { userId, isOnline, lastSeen });

        const update = (prev: any[]) => prev.map(c => {
          if (c.type === 'DIRECT') {
            const isOtherMember = (c.members || []).some((m: any) => {
              const mid = (m.userId?._id || m.userId || m.childId?._id || m.childId || '').toString();
              return mid === userId.toString();
            });

            if (isOtherMember) {
              // console.log('✅ Updating presence for chat:', c.name || c.id);
              return { ...c, isOnline, lastSeen };
            }
          }
          return c;
        });

        setContactslist(update);
      });

      socket.on('disconnect', () => {
        // console.log('🔌 Socket disconnected')
      });
      socket.on('added-to-conversation', (data: any) => {
        const convId = data.conversation._id;
        socket.emit('join-room', convId);
        fetchMyChats();
        toast.info("A new direct conversation has started.");
      });

      socketRef.current = socket;
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token, user?.id, user?._id]);

  const mergeMessages = (newChats: any[], currentChats: any[]) => {
    return newChats.map(nc => {
      const existing = currentChats.find(ec => ec._id === nc._id || ec.id === nc.id);
      return {
        ...nc,
        id: nc._id,
        messages: existing?.messages || nc.messages || []
      };
    });
  };

  const processChats = (chats: any[]) => {
    const myId = (user?.id || user?._id || '').toString();
    return chats.map((c: any) => {
      const lastSenderId = (c.lastMessageSenderId?._id || c.lastMessageSenderId || '').toString();
      return {
        ...c,
        id: c._id,
        isSenderLast: lastSenderId === myId,
        isSeenLast: (c.lastMessageIsReadBy || []).some((id: any) => (id._id || id).toString() !== lastSenderId)
      };
    });
  };

  const fetchMyChats = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/chats/my-chats`, authHeader);
      
      if (!res.data || !res.data.data || !Array.isArray(res.data.data)) {
        console.error("Invalid response format from /my-chats. Received:", typeof res.data === 'string' ? res.data.substring(0, 100) + '...' : res.data);
        return;
      }

      const allChats = processChats(res.data.data);

      setContactslist(prev => mergeMessages(allChats.filter((c: any) => c.type === 'DIRECT'), prev));
      
      if (!isAdmin) {
        setProgramChats(prev => mergeMessages(allChats.filter((c: any) => c.type === 'PROGRAM_GROUP'), prev));
        setBatchChats(prev => mergeMessages(allChats.filter((c: any) => c.type === 'GROUP'), prev));
      }
    } catch (err) {
      console.error('Error fetching my chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/chats/settings`, authHeader);
        if (res.data && res.data.data) {
          setIsDirectChatEnabled(res.data.data.isDirectChatEnabled);
          setIsGroupChatEnabled(res.data.data.isGroupChatEnabled ?? true);
        } else {
          console.error("Invalid response format from /chats/settings:", res.data);
        }
      } catch (err) {
        console.error("Error fetching chat settings:", err);
      }
    };
    if (token) fetchSettings();
  }, [token]);

  const toggleDirectChat = async () => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/admin/chats/settings/direct`, { 
        isDirectChatEnabled: !isDirectChatEnabled 
      }, authHeader);
      setIsDirectChatEnabled(res.data.data.isDirectChatEnabled);
      toast.success(`Direct chatting is now ${!isDirectChatEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  const toggleGroupChat = async () => {
    try {
      const res = await axios.patch(`${API_BASE_URL}/admin/chats/settings/group`, {
        isGroupChatEnabled: !isGroupChatEnabled
      }, authHeader);
      setIsGroupChatEnabled(res.data.data.isGroupChatEnabled);
      toast.success(`Group chatting is now ${!isGroupChatEnabled ? 'enabled' : 'disabled'}`);
    } catch (err) {
      toast.error("Failed to update settings");
    }
  };

  const findUsers = async (query: string) => {
    if (!query) return [];
    try {
      const res = await axios.get(`${API_BASE_URL}/chats/search-users?query=${query}`, authHeader);
      return res.data.data;
    } catch (err) {
      return [];
    }
  };

  const startDirectChat = async (targetUserId: string) => {
    try {
      if (!isDirectChatEnabled && !isAdmin) {
        toast.warning("Direct chatting is currently disabled");
        return;
      }
      const res = await axios.post(`${API_BASE_URL}/chats/direct`, { targetUserId }, authHeader);
      const newConv = res.data.data;
      if (socketRef.current) {
        socketRef.current.emit('join-room', newConv._id || newConv.id);
      }
      fetchMyChats();
      setActiveId(newConv._id || newConv.id);
      setChatCategory('direct');
      toast.success("Conversation started");
    } catch (err) {
      toast.error("Failed to start direct chat");
    }
  };

  const handleRemoveChat = async (conversationId: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/chats/${conversationId}`, authHeader);
      setContactslist(prev => prev.filter(c => c.id !== conversationId));
      if (activeId === conversationId) {
        setActiveId(null);
      }
      toast.success("Conversation removed");
    } catch (err) {
      toast.error("Failed to remove conversation");
    }
  };

  const handleTogglePin = async (conversationId: string) => {
    try {
      const url = `${API_BASE_URL}/chats/${conversationId}/pin`;
      console.log('🔗 Pinning URL:', url);
      const res = await axios.patch(url, {}, authHeader);
      toast.success(res.data.message);
      fetchMyChats(); // Refresh to apply sorting
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to toggle pin";
      toast.error(msg);
      console.error('❌ Pin toggle error:', err.response?.data || err.message);
    }
  };

  const fetchProgramChats = async () => {
    if (!isAdmin) return;
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/admin/chats/programs`, authHeader);
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setProgramChats(prev => mergeMessages(processChats(res.data.data), prev));
      }

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
      const res = await axios.get(`${API_BASE_URL}/admin/chats/batches`, authHeader);
      if (res.data && res.data.data && Array.isArray(res.data.data)) {
        setBatchChats(prev => mergeMessages(processChats(res.data.data), prev));
      }
    } catch (err) {
      console.error('Error fetching batch chats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) return;
    if (isParent && (chatCategory === 'discussion' || chatCategory === 'announcement')) {
      setChatCategory('direct');
      setActiveId(null);
      return;
    }
    if (chatCategory === 'direct' && !isDirectChatEnabled) {
      if (!isParent) {
        setChatCategory('announcement');
      }
      setActiveId(null);
      return;
    }
    if (chatCategory === 'discussion' && !isGroupChatEnabled) {
      setChatCategory(isDirectChatEnabled ? 'direct' : 'announcement');
      setActiveId(null);
      return;
    }
    if (isAdmin) {
      if (chatCategory === 'announcement') fetchProgramChats();
      else if (chatCategory === 'discussion') fetchBatchChats();
      else fetchMyChats(); // Fetches recent/pinned direct chats for Admin
    } else {
      fetchMyChats();
    }
  }, [chatCategory, token, isAdmin, isDirectChatEnabled, isGroupChatEnabled]);

  useEffect(() => {
    if (!isDirectChatEnabled && chatCategory === 'direct') {
      setActiveId(null);
    }
    if (!isGroupChatEnabled && chatCategory === 'discussion') {
      setActiveId(null);
    }
  }, [isDirectChatEnabled, isGroupChatEnabled, chatCategory]);

  const handleSyncMembers = async (chatId: string) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/chats/${chatId}/sync`, {}, authHeader);
      toast.success("Members synced successfully!");
    } catch (err) {
      toast.error("Failed to sync members");
    }
  };

  const handleGlobalSync = async () => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/admin/chats/sync-all`, {}, authHeader);
      toast.success(res.data.message);
      if (chatCategory === 'announcement') fetchProgramChats();
      if (chatCategory === 'discussion') fetchBatchChats();
    } catch (err) {
      toast.error("System sync failed");
    } finally {
      setLoading(false);
    }
  };

  const inputTextRef = useRef('');
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const rightSideBarRef = useRef<any>(null);
  const navigate = useNavigate();

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

  useEffect(() => {
     const fetchMessages = async () => {
        const isRealId = activeId?.length === 24;
        if (!isRealId) return;

        if (socketRef.current) {
          socketRef.current.emit('join-room', activeId);
        }

        try {
           const res = await axios.get(`${API_BASE_URL}/chats/${activeId}/messages`, authHeader);
           const messages = res.data.data.reverse().map((m: any) => ({
             ...m,
             id: m._id,
             isSender: (m.senderId?._id || m.senderId || m.childId?._id || m.childId) === (user?.id || user?._id),
             time: new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
           }));

           const updateMsg = (prev: any[]) => prev.map(c => 
             (c._id === activeId || c.id === activeId) ? { ...c, messages, unreadCount: 0 } : c
           );
           
           if (chatCategory === 'announcement') setProgramChats(updateMsg);
           else if (chatCategory === 'discussion') setBatchChats(updateMsg);
           else setContactslist(updateMsg);

           // MARK AS READ in backend
           await axios.post(`${API_BASE_URL}/chats/${activeId}/read`, {}, authHeader);
           window.dispatchEvent(new CustomEvent('chat-notification-update'));
        } catch (err) {
           console.error("Error fetching messages or marking as read:", err);
        }
     };
     fetchMessages();
  }, [activeId, chatCategory]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [contactslist, programChats, batchChats, activeId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (rightSideBarRef.current && !rightSideBarRef.current.contains(event.target)) {
        setIsContactInfoOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;

    const isRealId = activeId?.length === 24;

    if (isRealId) {
      try {
        const res = editingMessage 
          ? await axios.patch(
              `${API_BASE_URL}/chats/${activeId}/messages/${editingMessage._id || editingMessage.id}`,
              { text: inputText },
              authHeader
            )
          : await axios.post(
              `${API_BASE_URL}/chats/${activeId}/messages`,
              { 
                text: inputText, 
                type: 'text',
                ...(replyingTo ? { replyTo: replyingTo.id || replyingTo._id } : {})
              },
              authHeader
            );

        const newMessage = {
          ...res.data.data,
          id: res.data.data._id,
          isSender: true,
          time: new Date(res.data.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        const updateChat = (prev: any[]) => prev.map(c => {
          if (c._id === activeId || c.id === activeId) {
            const myId = (user?.id || user?._id || '').toString();
            if (editingMessage) {
              return { 
                ...c, 
                messages: (c.messages || []).map((m: any) => 
                  (m._id === (editingMessage._id || editingMessage.id) || m.id === (editingMessage._id || editingMessage.id)) ? newMessage : m
                ) 
              };
            }
            return { 
              ...c, 
              messages: [...(c.messages || []), newMessage],
              lastMessage: newMessage.text || (newMessage.type === 'image' ? '📷 Image' : newMessage.type === 'file' ? '📄 File' : '🎤 Audio'),
              time: newMessage.time,
              isSenderLast: true,
              isSeenLast: false
            };
          }
          return c;
        });

        if (chatCategory === 'announcement') setProgramChats(updateChat);
        else if (chatCategory === 'discussion') setBatchChats(updateChat);
        else setContactslist(updateChat);
        
        setInputText('');
        setReplyingTo(null);
        setEditingMessage(null);
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to process message");
      }
      return;
    }

    // Mock fallback
    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      isSender: true,
      senderName: 'You',
      status: 'sent',
      replyTo: replyingTo
    };

    setContactslist((prev) => prev.map((c) => 
      c.id === activeId ? { ...c, messages: [...(c.messages || []), newMessage] } : c
    ));
    setInputText('');
    setReplyingTo(null);
  };

  const handleReact = async (id: string, emoji: string) => {
    const userId = user?._id || user?.id;
    
    const updateMessagesWithReaction = (messages: any[], messageId: string, reactedEmoji: string) => {
      return messages.map((m) => {
        if (m.id === messageId || m._id === messageId) {
          const reactions = (m.reactions || []).map((r: any) => ({ ...r, users: [...(r.users || [])] }));
          const idx = reactions.findIndex((r: any) => r.emoji === reactedEmoji);

          if (idx > -1) {
             const userIdx = reactions[idx].users.findIndex((u: any) => (u === userId || u._id === userId));
             if (userIdx > -1) {
                reactions[idx].users.splice(userIdx, 1);
                reactions[idx].count = Math.max(0, (reactions[idx].count || reactions[idx].users.length + 1) - 1);
                if (reactions[idx].count === 0 && reactions[idx].users.length === 0) reactions.splice(idx, 1);
             } else {
                reactions[idx].users.push(userId);
                reactions[idx].count = (reactions[idx].count || reactions[idx].users.length - 1) + 1;
             }
          } else {
             reactions.push({ emoji: reactedEmoji, count: 1, users: [userId] });
          }
          return { ...m, reactions };
        }
        return m;
      });
    };

    const updateChat = (prev: any[]) => prev.map(c => 
      (c._id === activeId || c.id === activeId) ? { ...c, messages: updateMessagesWithReaction(c.messages || [], id, emoji) } : c
    );

    if (chatCategory === 'announcement') setProgramChats(updateChat);
    else if (chatCategory === 'discussion') setBatchChats(updateChat);
    else setContactslist(updateChat);

    try {
      await axios.post(
        `${API_BASE_URL}/chats/${activeId}/messages/${id}/react`,
        { emoji },
        authHeader
      );
    } catch (err) {
      console.error("Failed to sync reaction", err);
    }
  };

  const debouncedSearch = useMemo(() => debounce((query: string) => {
    const filtered = CONTACTS.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    setContactslist(filtered);
  }, 300), []);

  const searchChatDebounce = useMemo(() => debounce((query: string) => {
    if (!activeContact || !query) return;
    const match = activeContact.messages.find((m: any) => 
      m.text?.toLowerCase().includes(query.toLowerCase())
    );
    if (match) {
      scrollToMessage(match._id || match.id);
    }
  }, 300), [activeContact, activeId]);
  const searchContactRef = useRef<any>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContactRef.current && !searchContactRef.current.contains(event.target)) {
        setShowSearchInput(false);
        setContactslist(CONTACTS);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleReply = (message: any) => {
    setReplyingTo(message);
    setEditingMessage(null);
  }

  const handleEdit = (message: any) => {
    setEditingMessage(message);
    setInputText(message.text || '');
    setReplyingTo(null);
  }

  const handleDeleteMessage = async (messageId: string) => {
    if (!activeId) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/chats/${activeId}/messages/${messageId}`, authHeader);
      
      const update = (prev: any[]) => prev.map((c) => {
        if (c.id === activeId || c._id === activeId) {
          return {
            ...c,
            messages: (c.messages || []).filter((m: any) => m.id !== messageId && m._id !== messageId),
          };
        }
        return c;
      });
      
      setContactslist(update);
      setProgramChats(update);
      setBatchChats(update);
      toast.success("Message deleted");
    } catch (err) {
      toast.error("Failed to delete message");
    }
  };

  const handleStarMessage = (messageId: string) => {
    if (!activeId) return;
    const update = (prev: any[]) => prev.map((c) => {
      if (c.id === activeId || c._id === activeId) {
        return {
          ...c,
          messages: (c.messages || []).map((m: any) => (m.id === messageId || m._id === messageId) ? { ...m, isStarred: !m.isStarred } : m),
        };
      }
      return c;
    });
    setContactslist(update);
    setProgramChats(update);
    setBatchChats(update);
  };

  const starredMessagesList = useMemo(() => {
    return activeContact?.messages?.filter((m: any) => m.isStarred) || [];
  }, [activeContact]);

  const sharedMedia = (label: string) => {
    if (!activeContact?.messages) return [];
    return activeContact.messages.filter((m: any) => {
      if (label === 'photos') return m.type === 'image';
      if (label === 'videos') return m.type === 'video';
      if (label === 'link') return m.type === 'link';
      if (label === 'audio') return m.type === 'audio';
      if (label === 'files') return m.type === 'file';
      return false;
    });
  };

  const photoMedia = useMemo(() => sharedMedia('photos'), [activeContact]);
  const audioMedia = useMemo(() => sharedMedia('audio'), [activeContact]);
  const linkMedia = useMemo(() => sharedMedia('link'), [activeContact]);
  const fileMedia = useMemo(() => sharedMedia('files'), [activeContact]);

  const scrollToMessage = (msgId: string) => {
    const id = `msg-${msgId}`;
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'rounded-lg');
      setTimeout(() => {
        element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
      }, 3000);
    }
  };

  const pickAndSendEmoji = (emoji: string) => setInputText((prev) => prev + emoji);

  const uploadFile = async (file: File, category = 'chat') => {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload/${category}`, formData, {
        headers: { ...authHeader.headers, 'Content-Type': 'multipart/form-data' },
      });
      return res.data.data.url;
    } catch (err) {
      toast.error('Failed to upload file');
      throw err;
    }
  };

  const handleMediaSend = async (file: File, type: string) => {
    try {
      setLoading(true);
      const url = await uploadFile(file);
      const payload = {
        text: inputText || (type === 'image' ? 'Image' : type === 'file' ? 'Document' : type === 'audio' ? 'Voice Note' : ''),
        type: type,
        mediaUrl: url,
        fileName: file.name,
        fileSize: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        ...(replyingTo ? { replyTo: replyingTo.id || replyingTo._id } : {})
      };

      const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/chats/${activeId}/messages`, payload, authHeader);
      const newMessage = {
        ...res.data.data,
        id: res.data.data._id,
        isSender: true,
        time: new Date(res.data.data.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      };

      const updateChat = (prev: any[]) => prev.map(c => 
        (c._id === activeId || c.id === activeId) ? { ...c, messages: [...(c.messages || []), newMessage] } : c
      );

      if (chatCategory === 'announcement') setProgramChats(updateChat);
      else if (chatCategory === 'discussion') setBatchChats(updateChat);
      else setContactslist(updateChat);

      setReplyingTo(null); setSharedImage(null); setShowMediaPreview(false); setInputText('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const pickImage = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'image/*';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => { setSharedImage({ file, preview: reader.result }); setShowMediaPreview(true); };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const pickAudioFile = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = 'audio/*';
    input.onchange = (e: any) => { if (e.target.files[0]) handleMediaSend(e.target.files[0], 'audio'); };
    input.click();
  };

  const openDocumentHandler = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt';
    input.onchange = (e: any) => { if (e.target.files[0]) handleMediaSend(e.target.files[0], 'file'); };
    input.click();
  };

  const handleSendMedia = async () => {
    if (sharedImage?.file) await handleMediaSend(sharedImage.file, 'image');
  };

  const handleSendAudio = async (blobUrl: string) => {
    const blob = await fetch(blobUrl).then(r => r.blob());
    const file = new File([blob], `voice_note_${Date.now()}.webm`, { type: 'audio/webm' });
    await handleMediaSend(file, 'audio');
  };

  return (
    <div className="flex pt-16 h-[calc(100vh-64px)] overflow-hidden font-sans antialiased bg-background text-foreground">
      <ChatSidebar 
        isMobileSidebarOpen={isMobileSidebarOpen}
        setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        activeId={activeId}
        setActiveId={setActiveId}
        chatCategory={chatCategory}
        setChatCategory={setChatCategory}
        contactslist={contactslist}
        programChats={programChats}
        batchChats={batchChats}
        loading={loading}
        isAdmin={isAdmin}
        isParent={isParent}
        handleGlobalSync={handleGlobalSync}
        fetchProgramChats={fetchProgramChats}
        fetchBatchChats={fetchBatchChats}
        onRemoveChat={handleRemoveChat}
        onTogglePin={handleTogglePin}
        findUsers={findUsers}
        startDirectChat={startDirectChat}
        fetchMyChats={fetchMyChats}
        canStartDirectChat={canStartDirectChat}
        isDirectChatEnabled={isDirectChatEnabled}
        isGroupChatEnabled={isGroupChatEnabled}
        canToggleDirectChat={hasDirectTogglePermission}
        canToggleGroupChat={hasGroupTogglePermission}
        onToggleDirectChat={toggleDirectChat}
        onToggleGroupChat={toggleGroupChat}
      />

      <main className={`${!isMobileSidebarOpen ? 'flex' : 'hidden'} md:flex flex-col flex-1 relative h-full bg-background min-w-0 overflow-hidden w-full`}>
        {!activeId ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-card/10">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
               <MessageSquare className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Welcome to your Messaging Hub</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
               Select a conversation from the sidebar to view messages, send files, and manage your communications.
            </p>
          </div>
        ) : (
          <>
            <ChatHeader 
              activeContact={activeContact}
              setIsMobileSidebarOpen={setIsMobileSidebarOpen}
              setIsSearchActive={setIsSearchActive}
              isAdmin={isAdmin}
              activeId={activeId}
              setIsContactInfoOpen={setIsContactInfoOpen}
            />

            {isSearchActive && (
              <motion.div 
                initial={{ opacity: 0, scaleY: 0 }} 
                animate={{ opacity: 1, scaleY: 1 }}
                exit={{ opacity: 0, scaleY: 0 }}
                className="flex items-center gap-3 bg-muted/30 backdrop-blur-md border-b border-border px-6 py-3 origin-top z-40 sticky top-[73px]"
              >
                <div className="relative flex-1 group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    autoFocus 
                    onChange={(e) => searchChatDebounce(e.target.value)} 
                    placeholder="Search messages..." 
                    className="w-full bg-card/80 border border-border rounded-full pl-11 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/10 hover:border-border/80 transition-all shadow-sm"
                  />
                </div>
                <button 
                  onClick={() => setIsSearchActive(false)}
                  className="p-2.5 hover:bg-card rounded-full text-muted-foreground hover:text-foreground transition-all shadow-sm active:scale-95"
                >
                  <X className="h-5 w-5" />
                </button>
              </motion.div>
            )}

            <MessageList 
              scrollRef={scrollRef}
              activeContact={activeContact}
              handleReply={handleReply}
              handleEdit={handleEdit}
              handleDelete={handleDeleteMessage}
              handleReact={handleReact}
              handleStarMessage={handleStarMessage}
              user={user}
              chatPermissions={chatPermissions}
            />

            <MessageInput 
              activeContact={activeContact}
              hasBroadcastPermission={hasBroadcastPermission}
              hasWritePermission={hasWritePermission}
              replyingTo={replyingTo}
              setReplyingTo={setReplyingTo}
              editingMessage={editingMessage}
              setEditingMessage={setEditingMessage}
              handleSend={handleSend}
              inputText={inputText}
              setInputText={setInputText}
              attachmentMenuOpen={attachmentMenuOpen}
              setAttachmentMenuOpen={setAttachmentMenuOpen}
              setTakePictureMode={setTakePictureMode}
              openDocumentHandler={openDocumentHandler}
              pickImage={pickImage}
              pickAudioFile={pickAudioFile}
              showReactionPicker={showReactionPicker}
              setShowReactionPicker={setShowReactionPicker}
              pickAndSendEmoji={pickAndSendEmoji}
              setRecordAudioMode={setRecordAudioMode}
            />
          </>
        )}
      </main>

      {isContactInfoOpen && (
          <ChatInfoPanel 
            rightSideBarRef={rightSideBarRef}
            activeContact={activeContact}
            setIsContactInfoOpen={setIsContactInfoOpen}
            mediaTab={mediaTab}
            setMediaTab={setMediaTab}
            photoMedia={photoMedia}
            videoMedia={audioMedia}
            fileMedia={fileMedia}
            linkMedia={linkMedia}
            starredMessagesList={starredMessagesList}
            showDetails={showDetails}
            setShowDetails={setShowDetails}
            onNavigateToMessage={scrollToMessage}
          />
      )}

      {showMediaPreview && (
        <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center p-4 z-50">
          <div className="flex-1 bg-background rounded-2xl overflow-hidden border border-border shadow-2xl flex flex-col w-full max-w-2xl">
            <div className="bg-muted px-4 py-3 border-b border-border flex justify-between items-center">
              <span className="text-sm font-bold">Media Preview</span>
              <button onClick={() => { setShowMediaPreview(false); setSharedImage(null); }} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="p-4 flex-1 flex items-center justify-center bg-muted/30">
              <img src={sharedImage?.preview || sharedImage} alt="preview" className="max-h-[60vh] rounded-lg shadow-md object-contain" />
            </div>
            <div className="p-4 border-t border-border bg-card">
              <div className="flex gap-2">
                 <input 
                   type="text" placeholder="Add a caption..." 
                   className="flex-1 bg-muted border-none rounded-xl px-4 py-2 text-sm focus:ring-1 focus:ring-primary"
                   value={inputText} onChange={(e) => setInputText(e.target.value)}
                 />
                 <button onClick={handleSendMedia} className="h-10 w-10 flex items-center justify-center bg-primary text-primary-foreground rounded-lg"><Send className="h-5 w-5" /></button>
              </div>
            </div>
          </div>
        </div>
      )}

      {takePictureMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl aspect-video relative">
            <CameraComponent
              onCapture={async (imgData: string) => {
                const blob = await fetch(imgData).then(r => r.blob());
                const file = new File([blob], `camera_capture_${Date.now()}.png`, { type: 'image/png' });
                setSharedImage({ file, preview: imgData });
                setTakePictureMode(false);
                setShowMediaPreview(true);
              }}
              onClose={() => setTakePictureMode(false)}
            />
          </div>
        </div>
      )}

      {recordAudioMode && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-card rounded-lg p-6 w-full max-w-md mx-auto mt-20 shadow-lg shadow-amber-300/20">
            <AudioRecorder
              onSave={(audioData: string) => {
                setRecordAudioMode(false);
                handleSendAudio(audioData);
              }}
              onClose={() => setRecordAudioMode(false)}
            />
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--border); border-radius: 10px; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      {((chatCategory === 'direct' && !isDirectChatEnabled) ||
        (chatCategory === 'discussion' && !isGroupChatEnabled)) && (
        <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
          <div className="pointer-events-auto rounded-2xl border border-border bg-card shadow-xl p-6 text-center max-w-sm mx-4">
            <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              <ShieldOff className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="font-bold text-foreground mb-1">
              {chatCategory === 'direct' ? 'Direct Chat Disabled' : 'Group Chat Disabled'}
            </h3>
            <p className="text-sm text-muted-foreground">
              This section is deactivated. It will not render chat items until re-activated.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
