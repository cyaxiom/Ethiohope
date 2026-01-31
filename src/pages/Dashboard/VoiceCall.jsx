import {
  Mic,
  MicOff,
  PhoneOff,
  VideoOff,
  MessageSquare,
  X,
  Send,
  File,
  Icon,
} from 'lucide-react';
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
export default function VoiceCall() {
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="flex relative items-center justify-center min-h-screen bg-background">
      {/* Call Container */}
      <div className="relative w-full max-w-5xl h-[500px] md:h-[600px] flex ">
        <motion.div
          initial={{ width: '100%' }}
          animate={{
            width: isChatOpen ? '64%' : '100%',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={`bg-[#3f5a6b] relative rounded-xl p-6 flex flex-col w-full z-50 ${isChatOpen && isMobile ? 'hidden' : ''}`}
        >
          {/* Call Timer */}
          <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/20 text-white text-sm px-3 py-1 rounded-full">
            {/* recording indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-3 h-3 bg-red-600 rounded-full"
            ></motion.div>
            <span>40:12</span>
          </div>

          {/* Participants */}
          <div className="flex flex-1 items-center justify-center gap-24">
            <UserAvatar name="Mark Williams" speaking />
            <UserAvatar name="Benjamin" />
          </div>

          {/* Chat Button */}
          <button
            onClick={toggleChat}
            className="absolute bottom-6 right-6 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-purple-700 transition"
          >
            <MessageSquare size={22} />
          </button>
        </motion.div>
        {/* Chat Sidebar */}
        <AnimatePresence>
          {isChatOpen && (
            <motion.div className="absolute right-0 top-0 w-full md:w-1/3 h-full bg-background shadow-lg z-10 rounded-l-xl p-4 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sticky top-0 bg-background py-2 border-b border-muted-foreground">
                <h2 className="text-lg font-semibold">message</h2>
                <button
                  onClick={toggleChat}
                  className="w-8 h-8 bg-muted-foreground rounded-full flex items-center justify-center hover:bg-muted-foreground/20 transition"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4 custom-scrollbar">
                <MessageBubble
                  side="left"
                  message="Hey! How's the call going?"
                  time="10:00 AM"
                />
                <MessageBubble
                  side="right"
                  message="It's going great! Just discussing the new project."
                  time="10:01 AM"
                  seen
                />
                <MessageBubble
                  side="left"
                  message="Awesome! Let me know if you need any help."
                  time="10:02 AM"
                />
                <MessageBubble
                  side="left"
                  message="Hey! How's the call going?"
                  time="10:00 AM"
                />
                <MessageBubble
                  side="right"
                  message="It's going great! Just discussing the new project."
                  time="10:01 AM"
                  seen
                />
                <MessageBubble
                  side="left"
                  message="Awesome! Let me know if you need any help."
                  time="10:02 AM"
                />
                <MessageBubble
                  side="left"
                  message="Hey! How's the call going?"
                  time="10:00 AM"
                />
                <MessageBubble
                  side="right"
                  message="It's going great! Just discussing the new project."
                  time="10:01 AM"
                  seen
                />
                <MessageBubble
                  side="left"
                  message="Awesome! Let me know if you need any help."
                  time="10:02 AM"
                />
              </div>

              {/* Input */}
              <div className="flex items-center gap-2">
                <File size={20} className="text-gray-500 cursor-pointer" />
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 border border-muted-foreground rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <button className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition">
                  <Send size={20} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Call Controls */}
      <div className="absolute bottom-4 flex items-center gap-4">
        <ControlButton>
          <Mic size={22} />
        </ControlButton>

        <button className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white hover:bg-red-700 transition">
          <PhoneOff size={24} />
        </button>

        <ControlButton>
          <VideoOff size={22} />
        </ControlButton>
      </div>
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

/* ---------------- Sub Components ---------------- */

function UserAvatar({ name, speaking = false }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <motion.div
        initial={{ scale: 1 }}
        animate={{ scale: speaking ? [1, 1.05, 1] : 1 }}
        transition={{ repeat: speaking ? Infinity : 0, duration: 1.5 }}
        className={`relative w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-300 flex items-center justify-center mb-2.5 ${
          speaking
            ? 'ring-1 ring-blue-600 ring-offset-20 ring-offset-[#3f5a6b] ring-opacity-60'
            : ''
        }`}
      >
        <span className="text-gray-500 text-sm">300 × 300</span>

        {/* Mic indicator */}
        <div className="absolute bottom-3 right-[50%] transform translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
          <Mic size={16} />
        </div>
      </motion.div>

      <span className="text-white font-medium">{name}</span>
    </div>
  );
}

function ControlButton({ children }) {
  return (
    <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-700 hover:bg-gray-200 transition">
      {children}
    </button>
  );
}

function MessageBubble({ side = 'left', message, time, seen }) {
  const isRight = side === 'right';

  return (
    <div className={`flex ${isRight ? 'justify-end' : 'justify-start'}`}>
      <div className="flex items-end gap-2 max-w-[85%]">
        {!isRight && (
          <div className="w-8 h-8 bg-muted rounded-md flex-shrink-0" />
        )}

        <div
          className={`px-4 py-2 rounded-xl text-sm ${
            isRight
              ? 'bg-blue-100 text-gray-800 rounded-br-none'
              : 'bg-muted text-gray-800 rounded-bl-none'
          }`}
        >
          <p>{message}</p>
          <div className="text-[10px] text-gray-500 mt-1 flex items-center gap-1">
            {time}
            {seen && <span className="text-blue-600">✓✓</span>}
          </div>
        </div>

        {isRight && (
          <div className="w-8 h-8 bg-blue-100 rounded-md flex-shrink-0" />
        )}
      </div>
    </div>
  );
}
