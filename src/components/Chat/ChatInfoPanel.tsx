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
  Link2
} from 'lucide-react';
import Avatar from './Avatar';

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
          <Star className="h-5 w-5 text-warning cursor-pointer" />
          <Trash2 className="h-5 w-5 text-error cursor-pointer" />
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
                  {tab === 'photos' ? 'Photos' : tab === 'videos' ? 'Videos' : tab === 'file' ? 'File' : 'Link'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-2">
              {mediaTab === 'photos' &&
                photoMedia.map((p, i) => (
                  <div key={i} className="aspect-square rounded-xl bg-muted overflow-hidden border border-border">
                    <img src={p?.mediaUrl || p?.imageUrl} className="w-full h-full object-cover" alt="media" />
                  </div>
                ))}
              {mediaTab === 'videos' &&
                videoMedia.map((v, i) => (
                  <div key={i} className="relative aspect-square rounded-xl bg-muted overflow-hidden border border-border group cursor-pointer">
                    <img src={v?.thumbnail || v?.videoThumbnail} className="w-full h-full object-cover" alt="video" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-6 w-6 text-white fill-white" />
                    </div>
                  </div>
                ))}
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
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                      <Send className="h-4 w-4 rotate-90" />
                    </button>
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

        <div className="border-t border-border">
          <div className="p-2 space-y-1">
            {[
              { icon: <Star className="h-4 w-4" />, label: 'Starred Messages', badge: starredMessagesList.length },
              { icon: <VolumeX className="h-4 w-4" />, label: 'Mute Notifications' },
              { icon: <UserX className="h-4 w-4" />, label: 'Block User' },
              { icon: <Flag className="h-4 w-4" />, label: 'Report User' },
              { icon: <Trash2 className="h-4 w-4" />, label: 'Delete Chat' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                <button
                  onClick={() => setShowDetails(showDetails === item.label ? null : item.label)}
                  className="w-full flex items-center justify-between p-3 hover:bg-muted rounded-xl transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground">{item.icon}</span>
                    <span className="text-sm font-bold text-foreground">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && (
                      <span className="h-5 min-w-[1.25rem] flex items-center justify-center px-1.5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                        {item.badge}
                      </span>
                    )}
                    {showDetails === item.label ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                </button>
                {showDetails === item.label && item.label === 'Starred Messages' && (
                  <div className="mt-2 p-4 border border-border rounded-xl bg-muted/50 mx-2">
                    <h4 className="text-sm font-bold text-foreground mb-3">Starred Messages</h4>
                    {starredMessagesList.length === 0 ? (
                      <p className="text-sm text-muted-foreground">No starred messages.</p>
                    ) : (
                      <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
                        {starredMessagesList.map((msg) => (
                          <div key={msg.id} className="p-3 bg-muted rounded-lg border border-border">
                            {msg.type === 'text' ? (
                              <p className="text-sm text-foreground">{msg.text}</p>
                            ) : msg.type === 'image' ? (
                              <img src={msg.imageUrl || msg.mediaUrl} alt="starred" className="max-w-full h-auto rounded-md" />
                            ) : (
                                <p className="text-sm text-foreground italic">{msg.type} message</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </motion.aside>
  );
};

export default ChatInfoPanel;
