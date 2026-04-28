import React, { useMemo } from 'react';
import { MessageCircleX } from 'lucide-react';
import MessageBubble from './MessageBubble';
import dayjs from 'dayjs';

interface MessageListProps {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  activeContact: any;
  handleReply: (message: any) => void;
  handleEdit: (message: any) => void;
  handleDelete: (id: string) => void;
  handleReact: (id: string, emoji: string) => void;
  handleStarMessage: (id: string) => void;
  user: any;
  chatPermissions: any;
}

const MessageList: React.FC<MessageListProps> = ({
  scrollRef,
  activeContact,
  handleReply,
  handleEdit,
  handleDelete,
  handleReact,
  handleStarMessage,
  user,
  chatPermissions,
}) => {
  const groupedMessages = useMemo(() => {
    if (!activeContact?.messages) return [];
    const groups: { [key: string]: any[] } = {};
    
    // Sort messages by time to ensure grouping order is correct
    const sorted = [...activeContact.messages].sort((a, b) => 
      new Date(a.createdAt || a.date).getTime() - new Date(b.createdAt || b.date).getTime()
    );

    sorted.forEach((m: any) => {
      const date = dayjs(m.createdAt || m.date).format('YYYY-MM-DD');
      if (!groups[date]) groups[date] = [];
      groups[date].push(m);
    });
    return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
  }, [activeContact?.messages]);

  const formatHeaderDate = (dateStr: string) => {
    const d = dayjs(dateStr);
    const now = dayjs();
    if (d.isSame(now, 'day')) return 'Today';
    if (d.isSame(now.subtract(1, 'day'), 'day')) return 'Yesterday';
    return d.format('MMMM D, YYYY');
  };

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-card/50"
    >
      {activeContact?.messages?.length > 0 ? (
        groupedMessages.map(([date, msgs]) => (
          <React.Fragment key={date}>
            <div className="flex justify-center my-8">
              <span className="px-5 py-1.5 rounded-full bg-card border border-border text-xs font-bold text-muted-foreground shadow-sm">
                {formatHeaderDate(date)}
              </span>
            </div>
            {msgs.map((m: any) => (
              <MessageBubble
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                key={m._id || m.id || Math.random().toString()}
                message={m}
                onReact={handleReact}
                onStarMessage={handleStarMessage}
                currentUser={user}
                isAnnouncement={activeContact?.type === 'PROGRAM_GROUP'}
                chatPermissions={chatPermissions}
              />
            ))}
          </React.Fragment>
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
