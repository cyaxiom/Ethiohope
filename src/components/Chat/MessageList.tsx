import React from 'react';
import { MessageCircleX } from 'lucide-react';
import MessageBubble from './MessageBubble';

interface MessageListProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  activeContact: any;
  handleReply: (message: any) => void;
  handleReact: (id: string, emoji: string) => void;
  handleStarMessage: (id: string) => void;
  user: any;
  chatPermissions: any;
}

const MessageList: React.FC<MessageListProps> = ({
  scrollRef,
  activeContact,
  handleReply,
  handleReact,
  handleStarMessage,
  user,
  chatPermissions,
}) => {
  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-card/50"
    >
      <div className="flex justify-center my-8">
        <span className="px-5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground shadow-sm">
          Today, {new Date().toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}
        </span>
      </div>
      {activeContact?.messages?.length > 0 ? (
        activeContact.messages.map((m: any) => (
          <MessageBubble
            onReply={handleReply}
            key={m._id || m.id || Math.random().toString()}
            message={m}
            onReact={handleReact}
            onStarMessage={handleStarMessage}
            currentUser={user}
            isAnnouncement={activeContact?.type === 'PROGRAM_GROUP'}
            chatPermissions={chatPermissions}
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
  );
};

export default MessageList;
