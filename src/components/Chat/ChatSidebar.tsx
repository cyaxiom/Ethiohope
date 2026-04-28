import React from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MoreVertical,
  MessageSquarePlus,
  UserCircle,
  UserPlus,
  RefreshCw,
  CheckCheck,
  Pin,
  X,
  MessageSquare,
  Loader2,
  Trash2,
} from 'lucide-react';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

const ICON_BTN = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-0";

interface ChatSidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  loading: boolean;
  chatCategory: string;
  setChatCategory: (cat: 'direct' | 'discussion' | 'announcement') => void;
  contactslist: any[];
  setActiveId: (id: string) => void;
  activeId: string | null;
  programChats: any[];
  batchChats: any[];
  isAdmin: boolean;
  handleGlobalSync: () => void;
  fetchProgramChats: () => void;
  fetchBatchChats: () => void;
  findUsers: (query: string) => Promise<any[]>;
  startDirectChat: (targetId: string) => void;
  onRemoveChat: (conversationId: string) => void;
  onTogglePin: (conversationId: string) => void;
  fetchMyChats: () => void;
}

import { UserSearch, MessageSquareOff, Plus } from 'lucide-react';

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  loading,
  chatCategory,
  setChatCategory,
  contactslist,
  setActiveId,
  activeId,
  programChats,
  batchChats,
  isAdmin,
  handleGlobalSync,
  fetchProgramChats,
  fetchBatchChats,
  findUsers,
  startDirectChat,
  onRemoveChat,
  onTogglePin,
  fetchMyChats,
}) => {
  const [userSearchResults, setUserSearchResults] = React.useState<any[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = React.useState(false);
  const [userSearchQuery, setUserSearchQuery] = React.useState('');
  const [isLoadingResults, setIsLoadingResults] = React.useState(false);

  const handleUserSearch = async (query: string) => {
    setUserSearchQuery(query);
    if (query.trim().length > 0) {
      setIsLoadingResults(true);
      const results = await findUsers(query);
      setUserSearchResults(results);
      setIsLoadingResults(false);
      setIsSearchingUsers(true);
    } else {
      setUserSearchResults([]);
      setIsSearchingUsers(false);
      setIsLoadingResults(false);
    }
  };

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchingUsers(false);
        setUserSearchQuery('');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <aside
      className={`${isMobileSidebarOpen ? 'block w-full' : 'hidden'} md:block shrink-0 w-full md:w-[350px] border-r flex flex-col z-20`}
    >
      <div className="p-5 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">Messaging</h1>
        <div className="flex items-center gap-1">
          <button
            onClick={() => window.location.reload()}
            className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
            title="Refresh Page"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>


      <div className="px-5 mb-4">
        <div className="flex flex-col gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Find people to chat..."
              value={userSearchQuery}
              onChange={(e) => handleUserSearch(e.target.value)}
              className="w-full bg-muted/60 border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
            {userSearchQuery && (
               <button 
                  onClick={() => handleUserSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
               >
                  <X className="h-4 w-4" />
               </button>
            )}
          </div>
          
          <div className="relative">
            {isSearchingUsers && (
              <motion.div 
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute left-0 right-0 top-1 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] z-[100] max-h-[420px] overflow-hidden flex flex-col"
              >
                <div className="p-4 border-b border-border/50 bg-muted/20 flex justify-between items-center backdrop-blur-md">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/70">Program Members Found</span>
                  {isLoadingResults && <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />}
                </div>

                <div className="overflow-y-auto custom-scrollbar flex-1">
                  {isLoadingResults ? (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-pulse" />
                        <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-foreground">Searching Directory</p>
                         <p className="text-[10px] text-muted-foreground italic mt-1">Filtering colleagues and peers...</p>
                      </div>
                    </div>
                  ) : userSearchResults.length > 0 ? (
                    <div className="p-2 space-y-1">
                      {userSearchResults.map((u, i) => (
                        <motion.button
                          key={u.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => {
                            startDirectChat(u.id);
                            setUserSearchQuery('');
                            setIsSearchingUsers(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-primary/5 rounded-xl transition-all text-left group relative overflow-hidden"
                        >
                          <div className="absolute inset-y-0 left-0 w-1 bg-primary scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />
                          
                          <div className="relative">
                            <Avatar src={u.avatar} name={u.firstname} size="md" />
                            <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-card rounded-full flex items-center justify-center p-0.5 shadow-sm">
                               <div className={`h-full w-full rounded-full ${u.type === 'staff' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                            </div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors flex items-center gap-2">
                              {u.firstname} {u.lastname}
                              {u.id === activeId && (
                                 <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                              )}
                            </h5>
                            <div className="flex items-center gap-2">
                               <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-wider flex items-center gap-1">
                                  {u.type === 'staff' ? <UserCircle className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                                  {u.type}
                               </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                             <div className="text-[10px] font-bold text-primary mr-1">Message</div>
                             <MessageSquare className="h-4 w-4 text-primary" />
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-12 text-center flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                         <Search className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">No matches found</p>
                        <p className="text-[11px] text-muted-foreground mt-1 px-4">
                          Try searching for a different name or program member.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-3 bg-muted/20 border-t border-border/50 text-center">
                   <p className="text-[9px] text-muted-foreground italic">Press ESC to cancel search</p>
                </div>
              </motion.div>
            )}
          </div>

          <div className="flex p-1 bg-muted/60 rounded-xl">
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
                  onClick={() => {
                    setActiveId(chat._id);
                    setIsMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${activeId === chat._id ? 'bg-muted' : 'hover:bg-muted'}`}
                >
                  <Avatar src={chat.avatar} name={chat.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate text-foreground">
                      {chat.name}
                    </h4>
                    <p className="text-[10px] text-muted-foreground">
                      {chat.scheduleId 
                        ? `${chat.scheduleId.dayOfWeek} | ${chat.scheduleId.startTime} - ${chat.scheduleId.endTime} ${chat.ageGroup ? `[${chat.ageGroup}]` : ''}`
                        : (chat.programId?.title || chat.batchId?.batchName || 'Group Chat')}
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
            <div className="relative mb-6">
              <div className="px-4 py-2 bg-primary/5 border-l-4 border-primary mb-2 sticky top-0 z-10 backdrop-blur-md flex items-center gap-2">
                <Pin className="h-3 w-3 text-primary fill-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                  Pinned Favorites
                </h3>
              </div>
              {contactslist
                .filter((c) => c.isPinned)
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left cursor-pointer ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'}`}
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
                        <p className={`text-[11px] truncate ${c.isTyping ? 'text-primary font-bold animate-pulse' : 'text-muted-foreground'}`}>
                          {c.lastMessage}
                        </p>
                        <div className="flex items-center gap-1.5 opacity-100 transition-all">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               onTogglePin(c.id);
                             }}
                             className={`p-1.5 rounded-lg transition-all ${c.isPinned ? 'text-primary bg-primary/20 scale-110 shadow-md' : 'text-muted-foreground/60 hover:text-primary hover:bg-primary/10'}`}
                             title={c.isPinned ? "Unpin Chat" : "Pin Chat"}
                           >
                              <Pin className={`h-4 w-4 ${c.isPinned ? 'fill-primary' : ''}`} />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               if (window.confirm("Remove this chat from your list?")) {
                                 onRemoveChat(c.id);
                               }
                             }}
                             className="p-1.5 rounded-lg text-muted-foreground/60 hover:text-destructive hover:bg-destructive/10 transition-all"
                             title="Remove Chat"
                           >
                              <Trash2 className="h-3.5 w-3.5" />
                           </button>
                           <CheckCheck className="h-3.5 w-3.5 text-primary/70" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            <div className="relative">
              <div className="px-4 py-2 mb-2 sticky top-0 z-10 backdrop-blur-md">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Recent Activity
                </h3>
              </div>
              {contactslist
                .filter((c) => !c.isPinned)
                .map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setIsMobileSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left cursor-pointer ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'}`}
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
                        <div className="flex items-center gap-1.5">
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               onTogglePin(c.id);
                             }}
                             className={`p-1.5 rounded-lg transition-all ${c.isPinned ? 'text-primary bg-primary/20 scale-110 shadow-md' : 'text-muted-foreground/50 hover:text-primary hover:bg-primary/10'}`}
                             title={c.isPinned ? "Unpin Chat" : "Pin Chat"}
                           >
                              <Pin className={`h-4 w-4 ${c.isPinned ? 'fill-primary' : ''}`} />
                           </button>
                           <button 
                             onClick={(e) => {
                               e.stopPropagation();
                               if (window.confirm("Remove this chat from your list?")) {
                                 onRemoveChat(c.id);
                               }
                             }}
                             className="p-1.5 rounded-lg text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 transition-all"
                             title="Remove Chat"
                           >
                              <Trash2 className="h-3.5 w-3.5" />
                           </button>
                           {c.unreadCount && (
                             <span className="h-5 min-w-[1.25rem] flex items-center justify-center px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shadow-md">
                                {c.unreadCount}
                             </span>
                           )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;
