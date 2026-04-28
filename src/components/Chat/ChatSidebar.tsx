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
} from 'lucide-react';
import Avatar from './Avatar';
import Dropdown from './Dropdown';

const ICON_BTN = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-0";

interface ChatSidebarProps {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  showTopSearchInput: boolean;
  setShowSearchInput: (show: boolean) => void;
  debouncedSearch: (query: string) => void;
  isAdmin: boolean;
  handleGlobalSync: () => void;
  loading: boolean;
  fetchProgramChats: () => void;
  fetchBatchChats: () => void;
  chatCategory: string;
  setChatCategory: (cat: 'direct' | 'discussion' | 'announcement') => void;
  sidebarMenuOpen: boolean;
  setSidebarMenuOpen: (open: boolean) => void;
  showAllOnline: boolean;
  setShowAllOnline: (show: any) => void;
  contactslist: any[];
  setActiveId: (id: string) => void;
  activeId: string | null;
  programChats: any[];
  batchChats: any[];
  isDirectChatEnabled: boolean;
  toggleDirectChat: () => void;
  findUsers: (query: string) => Promise<any[]>;
  startDirectChat: (targetId: string) => void;
}

import { UserSearch, MessageSquareOff, Plus } from 'lucide-react';

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  showTopSearchInput,
  setShowSearchInput,
  debouncedSearch,
  isAdmin,
  handleGlobalSync,
  loading,
  fetchProgramChats,
  fetchBatchChats,
  chatCategory,
  setChatCategory,
  sidebarMenuOpen,
  setSidebarMenuOpen,
  showAllOnline,
  setShowAllOnline,
  contactslist,
  setActiveId,
  activeId,
  programChats,
  batchChats,
  isDirectChatEnabled,
  toggleDirectChat,
  findUsers,
  startDirectChat,
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
  return (
    <aside
      className={`${isMobileSidebarOpen ? 'block w-full' : 'hidden'} md:block shrink-0 w-full md:w-[350px] border-r flex flex-col z-20`}
    >
      <div className="p-5 flex items-center justify-between">
        {showTopSearchInput ? (
          <motion.input
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="ring-1 ring-gray-400 focus:ring-blue-500 focus:outline-none rounded-md px-4 py-1.5 w-full bg-muted"
            type="text"
            placeholder="Search conversations..."
          />
        ) : (
          <h1 className="text-xl font-bold text-foreground">Messaging</h1>
        )}
        <div className="flex items-center gap-1">
          {isAdmin && chatCategory === 'direct' && (
            <button
               onClick={toggleDirectChat}
               className={`p-2 rounded-lg transition-colors ${!isDirectChatEnabled ? 'text-destructive bg-destructive/10' : 'text-muted-foreground hover:bg-muted'}`}
               title={isDirectChatEnabled ? "Disable Direct Chat for everyone" : "Enable Direct Chat"}
            >
               {isDirectChatEnabled ? <MessageSquare className="h-5 w-5" /> : <MessageSquareOff className="h-5 w-5" />}
            </button>
          )}

          {!showTopSearchInput && (
            <button
              onClick={() => setShowSearchInput(true)}
              className="p-2 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
            >
              <Search className="h-5 w-5" />
            </button>
          )}

          {!showTopSearchInput && !isAdmin && (
            <button
              onClick={() => {
                if (chatCategory === 'announcement') fetchProgramChats();
                if (chatCategory === 'discussion') fetchBatchChats();
              }}
              className={`${ICON_BTN} p-2 rounded-full text-muted-foreground`}
            >
              <RefreshCw className="h-5 w-5" />
            </button>
          )}

          {!showTopSearchInput && (
            <button
              onClick={() => setShowSearchInput(!showTopSearchInput)}
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
          
          {isSearchingUsers && (
            <div className="absolute left-5 right-5 top-[165px] bg-card border border-border rounded-2xl shadow-2xl z-50 max-h-[400px] overflow-y-auto custom-scrollbar animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-3 border-b border-border bg-muted/30 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Search Results</span>
                {isLoadingResults && <Loader2 className="h-3 w-3 animate-spin text-primary" />}
              </div>
              {isLoadingResults ? (
                <div className="p-8 text-center flex flex-col items-center gap-2">
                   <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                   <p className="text-xs text-muted-foreground italic">Searching program members...</p>
                </div>
              ) : userSearchResults.length > 0 ? (
                 userSearchResults.map((u) => (
                   <button
                     key={u.id}
                     onClick={() => {
                        startDirectChat(u.id);
                        setUserSearchQuery('');
                        setIsSearchingUsers(false);
                     }}
                     className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left group"
                   >
                     <Avatar src={u.avatar} name={u.firstname} size="md" />
                     <div className="flex-1 min-w-0">
                       <h5 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                         {u.firstname} {u.lastname}
                       </h5>
                       <p className="text-[10px] text-muted-foreground flex items-center gap-1 uppercase tracking-tighter">
                          {u.type === 'staff' ? <UserCircle className="h-3 w-3" /> : <UserCircle className="h-3 w-3 text-blue-500" />}
                          {u.type}
                       </p>
                     </div>
                     <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-110" />
                   </button>
                 ))
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground italic">
                   No people found matching "{userSearchQuery}"
                </div>
              )}
            </div>
          )}

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

      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-foreground">Online Now</h2>
          <button
            onClick={() => setShowAllOnline((prev: boolean) => !prev)}
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
            <div className="relative">
              <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sticky top-0 left-0 w-full py-2 bg-background z-10">
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
                    className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'}`}
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
                        <p className={`text-xs truncate ${c.isTyping ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
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

            <div className="relative">
              <h3 className="px-4 mb-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground sticky top-0 left-0 w-full py-2 bg-background z-10">
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
                    className={`w-full flex items-center gap-3 p-4 transition-all rounded-2xl mb-1 group text-left ${activeId === c.id ? 'bg-muted' : 'hover:bg-muted'}`}
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
  );
};

export default ChatSidebar;
