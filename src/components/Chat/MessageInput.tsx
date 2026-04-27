import React from 'react';
import {
  MoreVertical,
  Camera,
  Smile,
  Mic,
  Send,
  Lock,
  FileText,
  ImageIcon,
  User
} from 'lucide-react';
import Dropdown from './Dropdown';
import ReactionPicker from './ReactionPicker';

interface MessageInputProps {
  activeContact: any;
  hasBroadcastPermission: boolean;
  replyingTo: any;
  setReplyingTo: (msg: any) => void;
  handleSend: (e?: React.FormEvent) => void;
  inputText: string;
  setInputText: (text: string) => void;
  attachmentMenuOpen: boolean;
  setAttachmentMenuOpen: (open: boolean) => void;
  setTakePictureMode: (mode: boolean) => void;
  openDocumentHandler: () => void;
  pickImage: () => void;
  pickAudioFile: () => void;
  shareContactHandler: () => void;
  showReactionPicker: boolean;
  setShowReactionPicker: (show: any) => void;
  pickAndSendEmoji: (emoji: string) => void;
  setRecordAudioMode: (mode: boolean) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  activeContact,
  hasBroadcastPermission,
  replyingTo,
  setReplyingTo,
  handleSend,
  inputText,
  setInputText,
  attachmentMenuOpen,
  setAttachmentMenuOpen,
  setTakePictureMode,
  openDocumentHandler,
  pickImage,
  pickAudioFile,
  shareContactHandler,
  showReactionPicker,
  setShowReactionPicker,
  pickAndSendEmoji,
  setRecordAudioMode,
}) => {
  return (
    <div className="border-t border-border bg-card px-2 md:px-5 py-3 md:py-4">
      {activeContact?.type === 'PROGRAM_GROUP' && !hasBroadcastPermission && !replyingTo ? (
        <div className="flex items-center justify-center py-2 px-4 bg-muted/50 rounded-xl border border-dashed border-border text-muted-foreground text-xs font-medium italic">
          <Lock className="w-3 h-3 mr-2" />
          This is a read-only announcement channel.
        </div>
      ) : (
        <>
          {replyingTo && (
            <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-border bg-muted/60 px-4 py-2.5">
              <div className="flex flex-col text-sm">
                <span className="text-xs font-semibold text-primary">
                  Replying to
                </span>
                <span className="truncate text-muted-foreground">
                  {replyingTo.text || 'Media'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setReplyingTo(null)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition"
              >
                ✕
              </button>
            </div>
          )}

          <form onSubmit={handleSend} className="flex items-center gap-1 md:gap-3 relative">
            <button
              type="button"
              onClick={() => setAttachmentMenuOpen(!attachmentMenuOpen)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={() => setTakePictureMode(true)}
              className="hidden md:flex h-11 w-11 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition"
              title="Take Photo"
            >
              <Camera className="h-5 w-5" />
            </button>

            {attachmentMenuOpen && (
              <div className="absolute bottom-full left-0 mb-3">
                <Dropdown
                  onClose={() => setAttachmentMenuOpen(false)}
                  items={[
                    {
                      icon: <FileText className="h-4 w-4 text-blue-500" />,
                      label: 'Document',
                      onClick: openDocumentHandler,
                    },
                    {
                      icon: <ImageIcon className="h-4 w-4 text-green-500" />,
                      label: 'Gallery',
                      onClick: pickImage,
                    },
                    {
                      icon: <Mic className="h-4 w-4 text-yellow-500" />,
                      label: 'Upload Audio/MP3',
                      onClick: pickAudioFile,
                    },
                    {
                      icon: <User className="h-4 w-4 text-orange-500" />,
                      label: 'Contact',
                      onClick: shareContactHandler,
                    },
                  ]}
                />
              </div>
            )}

            {showReactionPicker && (
              <ReactionPicker
                onClose={() => setShowReactionPicker(false)}
                onReact={pickAndSendEmoji}
              />
            )}

            <button
              onClick={() => setShowReactionPicker((prev: boolean) => !prev)}
              type="button"
              className="hidden sm:flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition cursor-pointer"
            >
              <Smile className="h-5 w-5" />
            </button>

            <button
              onClick={() => setRecordAudioMode(true)}
              type="button"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted transition cursor-pointer"
              title="Record Voice Message"
            >
              <Mic className="h-5 w-5" />
            </button>

            <div className="relative flex-1 min-w-0">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type..."
                className="h-10 w-full rounded-xl bg-muted px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 transition"
              />
            </div>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md hover:bg-primary/90 disabled:opacity-50 transition active:scale-95"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default MessageInput;
