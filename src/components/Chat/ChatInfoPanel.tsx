import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Star,
  Trash2,
  MessageSquarePlus,
  Play,
  FileText,
  Send,
  VolumeX,
  UserX,
  Flag,
  ChevronDown,
  ChevronRight,
  Link2,
  Download
} from 'lucide-react';
import Avatar from './Avatar';
import { Mic } from 'lucide-react';

const getMediaUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http') || url.startsWith('data:')) return url;
  const apiBase = (import.meta.env as any).VITE_API_BASE_URL || '';
  const serverRoot = apiBase.replace('/api/v1', '');
  return `${serverRoot}${url.startsWith('/') ? '' : '/'}${url}`;
};

interface ChatInfoPanelProps {
  rightSideBarRef: React.RefObject<any>;
  activeContact: any;
  setIsContactInfoOpen: (open: boolean) => void;
  mediaTab: string;
  setMediaTab: (tab: string) => void;
  photoMedia: any[];
  videoMedia: any[];
  fileMedia: any[];
  linkMedia: any[];
  starredMessagesList: any[];
  showDetails: string | null;
  setShowDetails: (details: string | null) => void;
  onNavigateToMessage: (id: string) => void;
}

const ChatInfoPanel: React.FC<ChatInfoPanelProps> = ({
  rightSideBarRef,
  activeContact,
  setIsContactInfoOpen,
  mediaTab,
  setMediaTab,
  photoMedia,
  videoMedia,
  fileMedia,
  linkMedia,
  starredMessagesList,
  showDetails,
  setShowDetails,
  onNavigateToMessage,
}) => {
  return (
    <motion.aside
      ref={rightSideBarRef}
      initial={{ x: '100%', opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeInOut' }}
      className="fixed inset-0 md:relative md:inset-auto shrink-0 w-full md:w-[320px] bg-card border-l border-border flex flex-col z-30"
    >
      <div className="p-5 flex items-center justify-between border-b border-border">
        <h2 className="text-base font-bold text-foreground">
          Contact Info
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsContactInfoOpen(false)}
            className="p-2 hover:bg-muted rounded-full"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-8 flex flex-col items-center text-center">
          <Avatar src={activeContact?.avatar} name={activeContact?.name} size="xl" />
          <h3 className="mt-5 text-xl font-bold text-foreground">
            {activeContact?.name}
          </h3>
          <p className="text-sm font-medium text-muted-foreground mt-1">
            Last seen recently
          </p>

          <div className="flex gap-3 mt-6">
            <button className="inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground h-10 w-10">
              <MessageSquarePlus className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          {activeContact?.programId ? (
            <>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Program Details</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeContact.programId.description || 'Exclusive announcement channel for the ' + activeContact.programId.title + ' program.'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Program</span>
                  <span className="text-sm font-medium text-muted-foreground truncate ml-4">{activeContact.programId.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Members</span>
                  <span className="text-sm font-medium text-muted-foreground">{activeContact.members?.length || 0}</span>
                </div>
              </div>
            </>
          ) : activeContact?.batchId ? (
            <>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Batch Info</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Collaborative discussion group for members of {activeContact.batchId.batchName}.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Batch</span>
                  <span className="text-sm font-medium text-muted-foreground">{activeContact.batchId.batchName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Members</span>
                  <span className="text-sm font-medium text-muted-foreground">{activeContact.members?.length || 0}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <h4 className="text-sm font-bold text-foreground mb-2">Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activeContact?.bio || 'No bio available'}
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Phone</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact?.phone || 'Not set'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">Email Address</span>
                  <span className="text-sm font-medium text-muted-foreground">
                    {activeContact?.email || 'Not set'}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="border-t border-border mt-4">
          <div className="p-5 flex items-center justify-between">
            <h4 className="text-sm font-bold text-foreground">Shared Media</h4>
            <button className="text-xs font-bold text-primary hover:underline uppercase tracking-wider">
              View All
            </button>
          </div>
          <div className="px-5 pb-6">
            <div className="flex gap-2 mb-6">
              {['photos', 'videos', 'file', 'link'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMediaTab(tab)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold capitalize transition-all ${mediaTab === tab
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-muted'
                    }`}
                >
                  {tab === 'photos' ? 'Photos' : tab === 'videos' ? 'Audio' : tab === 'file' ? 'File' : 'Link'}
                </button>
              ))}
            </div>

            <div className="mt-4">
              {mediaTab === 'photos' && (
                <div className="grid grid-cols-3 gap-2">
                  {photoMedia.map((p, i) => (
                    <div 
                      key={i} 
                      className="group/img relative aspect-square rounded-xl bg-muted overflow-hidden border border-border cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    >
                      <img
                        src={getMediaUrl(p?.mediaUrl || p?.imageUrl)}
                        className="w-full h-full object-cover"
                        alt="media"
                        onClick={() => onNavigateToMessage(p._id || p.id)}
                      />
                      <a 
                        href={getMediaUrl(p?.mediaUrl || p?.imageUrl)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-1.5 right-1.5 p-1 rounded-md bg-black/40 text-white opacity-0 group-hover/img:opacity-100 transition-opacity hover:bg-black/60"
                        title="Download"
                      >
                        <Download className="h-3 w-3" />
                      </a>
                    </div>
                  ))}
                </div>
              )}
              {mediaTab === 'videos' && (
                <div className="space-y-2">
                  {videoMedia.map((v, i) => (
                    <div 
                      key={i} 
                      onClick={() => onNavigateToMessage(v._id || v.id)}
                      className="flex items-center gap-3 bg-muted p-2 rounded-lg border border-border cursor-pointer hover:bg-muted-foreground/10 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Mic className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold truncate mb-1">{v.fileName || 'Voice Note'}</p>
                        <audio controls className="w-full h-8 scale-90 origin-left custom-audio-mini">
                          <source src={getMediaUrl(v.mediaUrl || v.audioUrl || v.mediaUrl)} />
                        </audio>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {mediaTab === 'file' && (
              <div className="space-y-4">
                {fileMedia.map((f, i) => (
                  <div key={i} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-10 w-10 shrink-0 rounded-lg bg-muted flex items-center justify-center border border-border">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{f.fileName}</p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                          {f.date || 'Today'} <span className="mx-1">|</span> {f?.fileSize}
                        </p>
                      </div>
                    </div>
                    <a 
                      href={getMediaUrl(f.mediaUrl)} 
                      download
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 text-muted-foreground hover:text-primary transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            )}

            {mediaTab === 'link' && (
              <div className="space-y-4">
                {linkMedia.map((l, i) => (
                  <a
                    key={i}
                    href={l.linkPreview?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                  >
                    {!l.linkPreview?.image && (
                      <div className="h-32 w-full bg-muted flex items-center justify-center">
                        <Link2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    {l.linkPreview?.image && (
                      <img src={l.linkPreview.image} alt="link preview" className="w-full h-32 object-cover" />
                    )}
                    <div className="p-3">
                      <h5 className="text-sm font-bold text-foreground mb-1 truncate">{l.linkPreview?.title}</h5>
                      <p className="text-xs text-muted-foreground truncate">{l.linkPreview?.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </motion.aside>
  );
};

export default ChatInfoPanel;
