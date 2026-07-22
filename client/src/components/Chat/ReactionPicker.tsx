import React from 'react';

interface ReactionPickerProps {
  onReact: (emoji: string) => void;
  onClose: () => void;
}

const ReactionPicker: React.FC<ReactionPickerProps> = ({ onReact, onClose }) => {
  const emojis = ['👍', '❤️', '😂', '😮', '🙏'];
  return (
    <div className="absolute bottom-full mb-2 left-0 bg-card border border-border rounded-full shadow-lg p-1.5 flex gap-1 animate-in slide-in-from-bottom-2 duration-200 z-50">
      {emojis.map((emoji) => (
        <button
          type="button"
          key={emoji}
          onClick={() => {
            onReact(emoji);
            onClose();
          }}
          className="w-9 h-9 flex items-center justify-center hover:bg-muted rounded-full text-lg transition-transform hover:scale-125"
        >
          {emoji}
        </button>
      ))}
    </div>
  );
};

export default ReactionPicker;
