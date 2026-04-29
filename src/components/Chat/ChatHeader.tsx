import React from 'react';
import {
  Search,
  ArrowLeft,
  X,
  Info
} from 'lucide-react';
import Avatar from './Avatar';

const ICON_BTN = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 py-2 px-0";

interface ChatHeaderProps {
  setIsMobileSidebarOpen: (open: boolean) => void;
  activeContact: any;
  setIsSearchActive: (active: boolean) => void;
  isAdmin: boolean;
  activeId: string | null;
  setIsContactInfoOpen: (open: boolean) => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  setIsMobileSidebarOpen,
  activeContact,
  setIsSearchActive,
  isAdmin,
  activeId,
  setIsContactInfoOpen,
}) => {
  return (
    <header className="flex items-center justify-between px-3 md:px-6 py-4 bg-card border-b border-border sticky top-0 z-40">
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
              : 'Last seen recently'}
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
          onClick={() => setIsContactInfoOpen(true)}
          className={`${ICON_BTN} p-2.5 rounded-xl text-muted-foreground`}
        >
          <Info className="h-5 w-5" />
        </button>


      </div>
    </header>
  );
};

export default ChatHeader;
