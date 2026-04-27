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
}

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
}) => {
  return (
    <aside
      className={`${isMobileSidebarOpen ? 'block w-full' : 'hidden'} md:block shrink-0 w-full md:w-[350px] border-r flex flex-col z-20`}
    >
      <div className="p-5 flex items-center justify-between">
        {!showTopSearchInput && (
          <h1 className="text-xl font-bold text-foreground">Message</h1>
        )}
        {showTopSearchInput && (
          <motion.input
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            onChange={(e) => debouncedSearch(e.target.value)}
            className="ring-1 ring-gray-500 focus:ring-blue-500 focus:border-none focus:outline-none focus:ring-1 rounded-md px-4 py-1 w-full"
            type="text"
            placeholder="search"
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
