import { NextFunction, Request, Response } from "express";
import { ChatService } from "./chat.service";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { ConversationModel, ConversationMemberModel } from "./chat.model";
import { MessageModel } from "./message.model";
import { HttpException } from "@common/errors/HttpException";
import { BatchModel } from "../Batches/batch.model";
import { broadcastMessage, notifyNewConversation, broadcastMessageUpdate, broadcastMessageDelete, broadcastMessagesRead } from "./chat.socket";
import { ChatSettingsModel } from "./chat.model";


export class ChatController {
  private _chatService: ChatService | null = null;
  private get chatService() {
    if (!this._chatService) this._chatService = new ChatService();
    return this._chatService;
  }

  private async getOrCreateChatSettings() {
    let settings = await ChatSettingsModel.findOne();
    if (!settings) {
      settings = await ChatSettingsModel.create({
        isDirectChatEnabled: true,
        isGroupChatEnabled: true,
      });
    }
    return settings;
  }

  /**
   * Get all chats the current user is a member of.
   * Works for Admin, Instructor, Parent, and Student (child).
   */
  public getMyChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.getOrCreateChatSettings();
      const tokenPayload = (req as any).tokenPayload;
      if (!tokenPayload) throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "User not authenticated");

      // Lazy sync for students: Ensure they are in their correct groups
      if (tokenPayload.type === 'child' || tokenPayload.type === 'student') {
        await this.chatService.syncUserGroups(tokenPayload._id);
      }

      // Find all conversation memberships for this user (by userId or childId)
      const memberships = await ConversationMemberModel.find({
        $or: [
          { userId: tokenPayload._id },
          { childId: tokenPayload._id }
        ]
      }).select('conversationId role isPinned');

      const conversationIds = memberships.map(m => m.conversationId);

      // Fetch conversations with populated references
      const conversations = await ConversationModel.find({ _id: { $in: conversationIds } })
        .populate('programId', 'title')
        .populate('batchId', 'batchName')
        .populate('scheduleId', 'dayOfWeek startTime endTime')
        .populate('membersCount')
        .populate({
          path: 'members',
          populate: [
            { path: 'userId', select: 'firstname lastname avatar email phone bio isOnline lastSeen' },
            { path: 'childId', select: 'firstname lastname avatar parent isOnline lastSeen', populate: { path: 'parent', select: 'email phone' } }
          ]
        })
        .sort({ updatedAt: -1 });

      // Attach the user's role in each conversation and handle DIRECT chat naming/avatar
      const currentUserId = tokenPayload._id.toString();
      const { MessageModel } = await import("./message.model");

      const result = await Promise.all(conversations.map(async (conv) => {
        const membership = memberships.find(m => m.conversationId.toString() === conv._id.toString());
        const convObj: any = conv.toObject();

        if (conv.type === 'DIRECT' && conv.members) {
          const otherMember = conv.members.find((m: any) => {
             const uId = m.userId?._id?.toString() || m.userId?.toString();
             const cId = m.childId?._id?.toString() || m.childId?.toString();
             return (uId !== currentUserId && cId !== currentUserId);
          });
          if (otherMember) {
            const target = otherMember.userId || otherMember.childId;
            if (target) {
              convObj.name = `${target.firstname || ''} ${target.lastname || ''}`.trim();
              convObj.avatar = (target as any).avatar;
              convObj.isOnline = target.isOnline;
              convObj.lastSeen = target.lastSeen || null;
              convObj.email = target.email || target.parent?.email || null;
              convObj.phone = target.phone || target.parent?.phone || null;
              convObj.bio = target.bio || null;
            }
          }
        }

        // Fetch last message
        const lastMsg = await MessageModel.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });

        // Fetch unread count
        const unreadCount = await MessageModel.countDocuments({
          conversationId: conv._id,
          isReadBy: { $ne: currentUserId },
          senderId: { $ne: currentUserId },
          childId: { $ne: currentUserId }
        });
        
        return {
          ...convObj,
          myRole: membership?.role || 'STUDENT',
          isPinned: membership?.isPinned || false,
          unreadCount,
          lastMessage: lastMsg?.text || (lastMsg?.type === 'image' ? '📷 Image' : lastMsg?.type === 'file' ? '📄 File' : lastMsg?.type === 'audio' ? '🎤 Audio' : "No messages yet"),
          lastMessageSenderId: lastMsg?.senderId || lastMsg?.childId || null,
          lastMessageIsReadBy: lastMsg?.isReadBy || [],
          time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
        };
      }));

      const visibleConversations = result.filter((conv: any) => {
        if (conv.type === 'DIRECT' && !settings.isDirectChatEnabled) return false;
        if (conv.type === 'GROUP' && !settings.isGroupChatEnabled) return false;
        return true;
      });

      // Sort: Pinned first, then recently updated
      visibleConversations.sort((a: any, b: any) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return 0;
      });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: visibleConversations,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all Program Announcement Chats (Admin only)
   */
  public getProgramAnnouncementChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const chats = await ConversationModel.find({ type: 'PROGRAM_GROUP' })
        .populate('programId', 'title')
        .populate('membersCount')
        .sort({ createdAt: -1 });

      const enrichedChats = await Promise.all(chats.map(async (conv) => {
        const convObj = conv.toObject();
        const lastMsg = await MessageModel.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });
        return {
          ...convObj,
          lastMessage: lastMsg?.text || (lastMsg?.type === 'image' ? '📷 Image' : lastMsg?.type === 'file' ? '📄 File' : lastMsg?.type === 'audio' ? '🎤 Audio' : "No messages yet"),
          lastMessageSenderId: lastMsg?.senderId || lastMsg?.childId || null,
          lastMessageIsReadBy: lastMsg?.isReadBy || [],
          time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
        };
      }));

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: enrichedChats,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all Batch Discussion Groups (Admin only)
   */
  public getBatchChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.getOrCreateChatSettings();
      if (!settings.isGroupChatEnabled) {
        return res.status(HttpStatusCodes.OK).json({ success: true, data: [] });
      }
      const chats = await ConversationModel.find({ 
        type: 'GROUP',
        scheduleId: { $ne: null },
        ageGroup: { $ne: null }
      })
        .populate('batchId', 'batchName')
        .populate('scheduleId', 'dayOfWeek startTime endTime')
        .populate('programId', 'title')
        .populate('membersCount')
        .sort({ createdAt: -1 });

      const enrichedChats = await Promise.all(chats.map(async (conv) => {
        const convObj = conv.toObject();
        const lastMsg = await MessageModel.findOne({ conversationId: conv._id }).sort({ createdAt: -1 });
        return {
          ...convObj,
          lastMessage: lastMsg?.text || (lastMsg?.type === 'image' ? '📷 Image' : lastMsg?.type === 'file' ? '📄 File' : lastMsg?.type === 'audio' ? '🎤 Audio' : "No messages yet"),
          lastMessageSenderId: lastMsg?.senderId || lastMsg?.childId || null,
          lastMessageIsReadBy: lastMsg?.isReadBy || [],
          time: lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : ""
        };
      }));

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: enrichedChats,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Force sync members for a conversation (Admin only)
   */
  public syncMembers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const conversation = await ConversationModel.findById(id);
      if (!conversation) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Conversation not found");

      if (conversation.type === 'PROGRAM_GROUP' && conversation.programId) {
        await this.chatService.syncProgramGroupMembers(conversation._id, conversation.programId.toString());
      } else if (conversation.type === 'GROUP' && conversation.batchId && conversation.scheduleId && conversation.ageGroup) {
        await this.chatService.ensureBatchGroupExists(conversation.batchId.toString());
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Members synced successfully",
      });
    } catch (error) {
      next(error);
    }
  };


  /**
   * Ensure/Create a program chat for a specific program ID
   */
  public ensureProgramChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId } = req.params;
      const chat = await this.chatService.ensureProgramGroupExists(programId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Program announcement group synced successfully",
        data: chat,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Rename/Update a conversation
   */
  public updateConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { name, isActive } = req.body;

      const updatedChat = await ConversationModel.findByIdAndUpdate(
        id,
        { $set: { name, isActive } },
        { new: true }
      );

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Conversation updated successfully",
        data: updatedChat,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get global chat settings
   */
  public getChatSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.getOrCreateChatSettings();
      res.status(HttpStatusCodes.OK).json({ success: true, data: settings });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update direct chat global settings
   */
  public updateDirectChatSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isDirectChatEnabled } = req.body;
      if (typeof isDirectChatEnabled !== 'boolean') {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "isDirectChatEnabled must be a boolean");
      }

      const settings = await ChatSettingsModel.findOneAndUpdate(
        {},
        { $set: { isDirectChatEnabled } },
        { new: true, upsert: true }
      );
      res.status(HttpStatusCodes.OK).json({ success: true, message: "Direct chat setting updated", data: settings });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update group chat global settings
   */
  public updateGroupChatSettings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { isGroupChatEnabled } = req.body;
      if (typeof isGroupChatEnabled !== 'boolean') {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "isGroupChatEnabled must be a boolean");
      }

      const settings = await ChatSettingsModel.findOneAndUpdate(
        {},
        { $set: { isGroupChatEnabled } },
        { new: true, upsert: true }
      );
      res.status(HttpStatusCodes.OK).json({ success: true, message: "Group chat setting updated", data: settings });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Search users for direct chat
   * Scoped to members of the programs the current user belongs to.
   */
  public searchUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const settings = await this.getOrCreateChatSettings();
      if (!settings.isDirectChatEnabled) {
        return res.status(HttpStatusCodes.OK).json({ success: true, data: [] });
      }

      const { query } = req.query;
      if (!query) return res.status(HttpStatusCodes.OK).json({ success: true, data: [] });

      const tokenPayload = (req as any).tokenPayload;
      if (!tokenPayload) throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "User not authenticated");
      const myId = tokenPayload._id;
      const isStudent = tokenPayload.type === 'child' || tokenPayload.type === 'student';

      let eligibleUserIds: string[] = [];
      let eligibleChildIds: string[] = [];

      const { User: UserModel } = await import("../User/user.schema");
      const { ChildModel } = await import("../Child/child.model");

      // ABAC: Check if user has permission to search all program members
      let canSearchAll = false;
      if (!isStudent) {
        const me = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });
        
        // Allowed if admin/super admin OR has the explicit attribute
        const isStaffAdmin = me?.roles?.some((r: any) => 
          ['admin', 'super_admin', 'superadmin', 'administrator'].includes(r.code?.toLowerCase())
        );
        const hasSearchPermission = me?.roles?.some((r: any) => 
          r.permissions?.some((p: any) => p.key === 'chat.direct.search.all')
        );
        canSearchAll = isStaffAdmin || hasSearchPermission || false;
      }

      // Admins are always eligible for everyone to find
      const { RoleModel } = await import("../AccessControl/role.model");
      const adminRoles = await RoleModel.find({ code: { $in: ['admin', 'super_admin', 'superadmin', 'administrator'] } }).select('_id');
      const admins = await UserModel.find({ roles: { $in: adminRoles.map(r => r._id) }, status: 'active' }).select('_id');
      const adminIds = admins.map(a => a._id.toString());

      if (canSearchAll) {
         // Staff with permission can search ANYONE who is in ANY program group
         const allProgramGroups = await ConversationModel.find({ type: 'PROGRAM_GROUP' }).select('_id');
         const allMembers = await ConversationMemberModel.find({
            conversationId: { $in: allProgramGroups.map(g => g._id) }
         }).select('userId childId');
         eligibleUserIds = [...new Set([...adminIds, ...allMembers.map(m => m.userId?.toString()).filter(Boolean)])] as string[];
         eligibleChildIds = [...new Set(allMembers.map(m => m.childId?.toString()).filter(Boolean))] as string[];
      } else {
        // Restricted to shared program groups + all admins
        const myMemberships = await ConversationMemberModel.find({
          $or: [{ userId: myId }, { childId: myId }]
        }).select('conversationId');

        const myConvIds = myMemberships.map(m => m.conversationId);
        const myProgramGroups = await ConversationModel.find({
          _id: { $in: myConvIds },
          type: 'PROGRAM_GROUP'
        }).select('_id');
        
        const myProgramGroupIds = myProgramGroups.map(g => g._id);

        const allProgramMembers = await ConversationMemberModel.find({
          conversationId: { $in: myProgramGroupIds }
        }).select('userId childId');

        eligibleUserIds = [...new Set([...adminIds, ...allProgramMembers.map(m => m.userId?.toString()).filter(Boolean)])] as string[];
        eligibleChildIds = [...new Set(allProgramMembers.map(m => m.childId?.toString()).filter(Boolean))] as string[];

        // Family & Education Fallback
        if (tokenPayload.type === 'adult') {
           // 1. Find my children
           const myChildren = await ChildModel.find({ parent: myId }).select('_id');
           const myChildIds = myChildren.map(c => c._id);
           eligibleChildIds = [...new Set([...eligibleChildIds, ...myChildIds.map(id => id.toString())])];

           // 2. Find Instructors teaching my children
           const { EnrollmentModel } = await import('../Enrollments/enrollment.model');
           const childEnrollments = await EnrollmentModel.find({ child: { $in: myChildIds }, status: 'ACTIVE' }).select('program');
           const childProgramIds = childEnrollments.map(e => e.program);
           
           const childBatches = await BatchModel.find({ program: { $in: childProgramIds } }).select('instructor');
           const childInstructorIds = childBatches.map(b => b.instructor?.toString()).filter(Boolean) as string[];
           eligibleUserIds = [...new Set([...eligibleUserIds, ...childInstructorIds])];
        } else if (isStudent) {
           // 1. Find my parent
           const myProfile = await ChildModel.findById(myId).select('parent');
           if (myProfile?.parent) {
             eligibleUserIds = [...new Set([...eligibleUserIds, myProfile.parent.toString()])];
           }

           // 2. Find my instructors (students should already find them via shared Program Groups, 
           // but this is a safety fallback for missing memberships)
           const { EnrollmentModel } = await import('../Enrollments/enrollment.model');
           const myEnrollments = await EnrollmentModel.find({ child: myId, status: 'ACTIVE' }).select('program');
           const myProgramIds = myEnrollments.map(e => e.program);
           
           const myBatches = await BatchModel.find({ program: { $in: myProgramIds } }).select('instructor');
           const myInstructorIds = myBatches.map(b => b.instructor?.toString()).filter(Boolean) as string[];
           eligibleUserIds = [...new Set([...eligibleUserIds, ...myInstructorIds])];
        }
      }
      
      const searchRegex = new RegExp(query as string, 'i');

      // Final Query Construction
      const staffQuery: any = {
        $or: [{ firstname: searchRegex }, { lastname: searchRegex }, { email: searchRegex }],
        status: 'active'
      };
      const childQuery: any = {
        $or: [{ firstname: searchRegex }, { lastname: searchRegex }]
      };

      // If not Admin/Staff with search.all permission, apply restrictions
      if (!canSearchAll) {
        staffQuery._id = { $in: eligibleUserIds };
        childQuery._id = { $in: eligibleChildIds };
      }

      const staff = await UserModel.find(staffQuery)
        .select('firstname lastname avatar email roles')
        .populate('roles', 'name code')
        .limit(20);

      const students = await ChildModel.find(childQuery)
        .select('firstname lastname avatar')
        .limit(20);

      const result = [
        ...staff.map(s => {
          const sObj = s.toObject();
          const roles = (s as any).roles || [];

          // Priority logic for multiple roles
          const rolePriority: Record<string, number> = {
            'super_admin': 1,
            'admin': 2,
            'superadmin': 2,
            'administrator': 2,
            'instructor': 3,
            'parent': 4,
            'user': 10
          };

          // Filter out 'user' if others exist, then sort by priority
          let sortedRoles = [...roles].sort((a: any, b: any) => {
             const codeA = (a as any).code?.toLowerCase() || '';
             const codeB = (b as any).code?.toLowerCase() || '';
             const pA = rolePriority[codeA] || 99;
             const pB = rolePriority[codeB] || 99;
             return pA - pB;
          });

          const roleDisplay = sortedRoles.length > 0 ? sortedRoles[0].name : 'Staff';
          
          return { 
            ...sObj, 
            id: s._id, 
            type: 'staff', 
            roleName: roleDisplay 
          };
        }),
        ...students.map(s => ({ 
          ...s.toObject(), 
          id: s._id, 
          type: 'student', 
          roleName: 'Student' 
        }))
      ];

      res.status(HttpStatusCodes.OK).json({ success: true, data: result });
    } catch (error) { next(error); }
  };

    /**
     * Ensure/Create a direct chat between current user and target user
     */
    public startDirectChat = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const settings = await this.getOrCreateChatSettings();
        if (!settings.isDirectChatEnabled) {
          throw new HttpException(HttpStatusCodes.FORBIDDEN, "Direct messaging is currently disabled by administrator.");
        }

        const tokenPayload = (req as any).tokenPayload;
        const { targetUserId } = req.body;
        const myId = tokenPayload._id;
  
        if (myId === targetUserId) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Cannot chat with yourself");
  
        // Check if direct chat exists
        const existingMemberships = await ConversationMemberModel.find({
          $or: [
            { userId: myId }, { childId: myId },
            { userId: targetUserId }, { childId: targetUserId }
          ]
        });
  
        // Group memberships by conversationId to find common one
        const convMap = new Map<string, number>();
        existingMemberships.forEach(m => {
          const cid = m.conversationId.toString();
          convMap.set(cid, (convMap.get(cid) || 0) + 1);
        });
  
        let foundConvId = '';
        for (const [cid, count] of convMap.entries()) {
          if (count === 2) {
            const conv = await ConversationModel.findOne({ _id: cid, type: 'DIRECT' });
            if (conv) { foundConvId = cid; break; }
          }
        }

        const isStudent = tokenPayload.type === 'child' || tokenPayload.type === 'student';
  
        // Attribute Based Access: check if this user is allowed to start direct chats
        if (!isStudent) {
           const { User: UserModel } = await import("../User/user.schema");
           const user = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });
           const hasDirectChatPermission = user?.roles?.some((r: any) => 
              r.permissions?.some((p: any) => p.key === 'chat.direct.start' || p.key === 'chat.direct')
           );
           // If they are not admin and don't have the permission, block it (unless they are already in the chat)
           const isAdminMember = user?.roles?.some((r: any) => ['admin', 'super_admin', 'superadmin'].includes(r.code?.toLowerCase()));
           if (!isAdminMember && !hasDirectChatPermission) {
              // we already check existing memberships above, so if it's new, we check permission
              if (!foundConvId) throw new HttpException(HttpStatusCodes.FORBIDDEN, "You do not have permission to start new direct chats.");
           }
        }

        // Security: Ensure they belong to the same program if starting a NEW chat (ABAC check)
        if (!foundConvId) {
            const myGroups = await ConversationMemberModel.find({
              $or: [{ userId: myId }, { childId: myId }]
            }).distinct('conversationId');
            
            const targetGroups = await ConversationMemberModel.find({
              $or: [{ userId: targetUserId }, { childId: targetUserId }]
            }).distinct('conversationId');

            // Find shared PROGRAM_GROUP conversations
            const commonGroups = await ConversationModel.find({
              _id: { $in: myGroups.filter(x => targetGroups.some(y => y.toString() === x.toString())) },
              type: 'PROGRAM_GROUP'
            });

            if (commonGroups.length === 0) {
              // Check if they have permission to start chats with anyone
              let canBypass = false;
              if (!isStudent) {
                 const { User: UserModel } = await import("../User/user.schema");
                 const user = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });
                 canBypass = user?.roles?.some((r: any) => 
                   ['super_admin', 'superadmin', 'admin'].includes(r.code?.toLowerCase()) ||
                   r.permissions?.some((p: any) => p.key === 'chat.direct.start')
                 ) || false;
              }
              if (!canBypass) throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: You can only start direct chats with members of your own programs.");
            }
        }

        if (foundConvId) {
          // Ensure membership exists (in case it was removed)
          const membershipData: any = { conversationId: foundConvId, role: isStudent ? 'STUDENT' : 'ADMIN' };
          if (isStudent) membershipData.childId = myId;
          else membershipData.userId = myId;

          await ConversationMemberModel.findOneAndUpdate(
            { conversationId: foundConvId, $or: [{ userId: myId }, { childId: myId }] },
            membershipData,
            { upsert: true, new: true }
          );

          const conv = await ConversationModel.findById(foundConvId).populate({
            path: 'members',
            populate: [
              { path: 'userId', select: 'firstname lastname avatar email phone bio' },
              { path: 'childId', select: 'firstname lastname avatar parent', populate: { path: 'parent', select: 'email phone' } }
            ]
          });
          
          const convObj: any = conv!.toObject();
          // Resolve other member name for DIRECT chats
          if (convObj.members) {
            const otherMember = convObj.members.find((m: any) => {
               const mid = (m.userId?._id || m.userId || m.childId?._id || m.childId || '').toString();
               return mid !== myId.toString();
            });
            if (otherMember) {
              const target = otherMember.userId || otherMember.childId;
              if (target) {
                convObj.name = `${target.firstname || ''} ${target.lastname || ''}`.trim();
                convObj.avatar = (target as any).avatar;
                convObj.email = target.email || target.parent?.email || null;
                convObj.phone = target.phone || target.parent?.phone || null;
                convObj.bio = target.bio || null;
              }
            }
          }
          return res.status(HttpStatusCodes.OK).json({ success: true, data: convObj });
        }
  
        // Create new direct conversation
        const newConv = await ConversationModel.create({
          type: 'DIRECT',
          isActive: true,
          name: 'Direct Message'
        });
  
        // Add members
        const isMeStudent = isStudent;
        
        const User = (await import("../User/user.schema")).User;
        let targetUser = await User.findById(targetUserId);
        let isTargetStudent = false;
        
        if (!targetUser) {
          const ChildModel = (await import("../Child/child.model")).ChildModel;
          targetUser = await ChildModel.findById(targetUserId);
          isTargetStudent = true;
        }
        
        if (!targetUser) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Target user not found");
  
        await ConversationMemberModel.create([
          { conversationId: newConv._id, [isMeStudent ? 'childId' : 'userId']: myId, role: 'ADMIN' },
          { conversationId: newConv._id, [isTargetStudent ? 'childId' : 'userId']: targetUserId, role: 'ADMIN' }
        ]);
  
        // Populate for immediate feedback
        const populatedConv = await ConversationModel.findById(newConv._id).populate({
            path: 'members',
            populate: [
              { path: 'userId', select: 'firstname lastname avatar email phone bio' },
              { path: 'childId', select: 'firstname lastname avatar parent', populate: { path: 'parent', select: 'email phone' } }
            ]
        });

        const convObj: any = populatedConv!.toObject();
        // Resolve other member name for DIRECT chats
        if (convObj.members) {
          const otherMember = convObj.members.find((m: any) => {
             const mid = (m.userId?._id || m.userId || m.childId?._id || m.childId || '').toString();
             return mid !== myId.toString();
          });
          if (otherMember) {
            const target = otherMember.userId || otherMember.childId;
            if (target) {
              convObj.name = `${target.firstname || ''} ${target.lastname || ''}`.trim();
              convObj.avatar = (target as any).avatar;
              convObj.email = target.email || target.parent?.email || null;
              convObj.phone = target.phone || target.parent?.phone || null;
              convObj.bio = target.bio || null;
            }
          }
        }
  
        // Notify both users
        notifyNewConversation([myId.toString(), targetUserId.toString()], convObj);
  
        res.status(HttpStatusCodes.CREATED).json({ success: true, data: convObj });
      } catch (error) { next(error); }
    };

  /**
   * Send a message to a conversation
   */
  public sendMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const { text, type, mediaUrl, fileName, fileSize, replyTo } = req.body;
      
      // Access token payload from request (attached by authMiddleware)
      const tokenPayload = (req as any).tokenPayload;
      if (!tokenPayload) throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "User not authenticated");

      let currentUser: any = null;
      const isStudent = tokenPayload.type === 'child' || tokenPayload.type === 'student';

      if (isStudent) {
        const { ChildModel } = await import("../Child/child.model");
        currentUser = await ChildModel.findById(tokenPayload._id);
        // Students in this system currently have implicit permissions or roles assigned 
        // For simulation, we assume they have 'chat.reply' and 'chat.react' if authenticated
        currentUser.roles = []; // fallback for role-based loops
      } else {
        const { User: UserModel } = await import("../User/user.schema");
        currentUser = await UserModel.findById(tokenPayload._id).populate({
          path: 'roles',
          populate: { path: 'permissions' }
        });
      }

      if (!currentUser) throw new HttpException(HttpStatusCodes.NOT_FOUND, isStudent ? "Student profile not found" : "User not found");

      const conversation = await ConversationModel.findById(conversationId);
      if (!conversation) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Conversation not found");

      const settings = await this.getOrCreateChatSettings();
      if (conversation.type === 'DIRECT' && !settings.isDirectChatEnabled) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Direct messaging is currently disabled by administrator.");
      }
      if (conversation.type === 'GROUP' && !settings.isGroupChatEnabled) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Group chat is currently disabled by administrator.");
      }

      // Membership Check (ABAC)
      const membership = await ConversationMemberModel.findOne({
        conversationId,
        $or: [{ userId: tokenPayload._id }, { childId: tokenPayload._id }]
      });

      if (!membership) {
        // Staff check: maybe they have reply.all? 
        // Typically only members can send messages.
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: You are not a member of this conversation.");
      }

      // Scalable RBAC/ABAC: Broadcast Logic
      if (conversation.type === 'PROGRAM_GROUP') {
        const isStaffAdmin = !isStudent && currentUser.roles?.some((r: any) => 
          ['admin', 'super_admin', 'superadmin', 'administrator'].includes(r.code?.toLowerCase())
        );
        
        const hasBroadcastPermission = !isStudent && currentUser.roles?.some((r: any) => 
          r.permissions?.some((p: any) => p.key === 'chat.broadcast')
        );

        const hasReplyPermission = isStudent || currentUser.roles?.some((r: any) => 
          r.permissions?.some((p: any) => p.key === 'chat.reply')
        );

        if (!isStaffAdmin && !hasBroadcastPermission) {
           if (replyTo && hasReplyPermission) {
             // By-pass global broadcast disable: They are specifically allowed to reply
           } else {
             throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: Missing required attribute [chat.broadcast] to post in this channel.");
           }
        }
      }

      const messageData: any = {
        conversationId,
        text,
        type,
        mediaUrl,
        fileName,
        fileSize,
        replyTo,
        isReadBy: [currentUser._id]
      };

      if (isStudent) {
        messageData.childId = currentUser._id;
      } else {
        messageData.senderId = currentUser._id;
      }

      const message = await MessageModel.create(messageData);

      // Populate sender info for the broadcast
      const populatedMessage = await MessageModel.findById(message._id)
        .populate('senderId', 'firstname lastname avatar')
        .populate('childId', 'firstname lastname avatar')
        .populate({
           path: 'replyTo',
           populate: [
             { path: 'senderId', select: 'firstname lastname' },
             { path: 'childId', select: 'firstname lastname' }
           ]
        });

      // Broadcast via Socket.io to all connected room members
      broadcastMessage(conversationId, populatedMessage);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Message sent successfully",
        data: populatedMessage,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get messages for a conversation
   */
  public getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const tokenPayload = (req as any).tokenPayload;
      if (!tokenPayload) throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "User not authenticated");
      const myId = tokenPayload._id;

      const conversation = await ConversationModel.findById(conversationId).select('type');
      if (!conversation) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Conversation not found");
      const settings = await this.getOrCreateChatSettings();
      if (conversation.type === 'DIRECT' && !settings.isDirectChatEnabled) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Direct messaging is currently disabled by administrator.");
      }
      if (conversation.type === 'GROUP' && !settings.isGroupChatEnabled) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Group chat is currently disabled by administrator.");
      }

      // Membership Check (Attribute Based)
      const membership = await ConversationMemberModel.findOne({
        conversationId,
        $or: [{ userId: myId }, { childId: myId }]
      });

      if (!membership) {
         // Check if they have read.all permission (Staff/Admins)
         if (tokenPayload.type !== 'child') {
            const { User: UserModel } = await import("../User/user.schema");
            const staff = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });
            const canReadAll = staff?.roles?.some((r: any) => 
              r.permissions?.some((p: any) => p.key === 'chat.read.all')
            );
            if (!canReadAll) throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: You are not a member of this conversation.");
         } else {
            throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: Membership required.");
         }
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 50;

      const messages = await MessageModel.find({ conversationId })
        .populate('senderId', 'firstname lastname avatar')
        .populate('childId', 'firstname lastname avatar')
        .populate({
           path: 'replyTo',
           populate: [
             { path: 'senderId', select: 'firstname lastname' },
             { path: 'childId', select: 'firstname lastname' }
           ]
        })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: messages,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * React to a message
   */
  public reactToMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { messageId } = req.params;
      if (!messageId || messageId === 'undefined') {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Message ID is required");
      }
      const { emoji } = req.body;

      const tokenPayload = (req as any).tokenPayload;
      if (!tokenPayload) throw new HttpException(HttpStatusCodes.UNAUTHORIZED, "User not authenticated");

      const message = await MessageModel.findById(messageId);
      if (!message) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Message not found");

      const userId = tokenPayload._id;

      // Membership Check for Reaction (ABAC)
      const membership = await ConversationMemberModel.findOne({
        conversationId: message.conversationId,
        $or: [{ userId }, { childId: userId }]
      });

      if (!membership) {
         throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: You must be a member of the conversation to react.");
      }

      // Handle reaction toggle
      let reactions = message.reactions || [];
      let reactionIndex = reactions.findIndex(r => r.emoji === emoji);

      if (reactionIndex > -1) {
        // Emoji exists, check if user already reacted
        const userIndex = reactions[reactionIndex].users.findIndex(u => u.toString() === userId.toString());
        if (userIndex > -1) {
          // Remove reaction
          reactions[reactionIndex].users.splice(userIndex, 1);
          // Cleanup if empty
          if (reactions[reactionIndex].users.length === 0) {
            reactions.splice(reactionIndex, 1);
          }
        } else {
           // Add user
           reactions[reactionIndex].users.push(userId);
        }
      } else {
        // Emoji doesn't exist, add it
        reactions.push({ emoji, users: [userId] });
      }

      message.reactions = reactions;
      await message.save();

      // Broadcast reaction change globally
      broadcastMessage(`reaction-${message.conversationId.toString()}`, { messageId, reactions });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Reaction updated",
        data: message,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove a conversation from the user's recent list
   * For Direct chats, this removes the membership.
   */
  public removeConversation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      // Find and delete the membership
      const result = await ConversationMemberModel.findOneAndDelete({
        conversationId,
        $or: [{ userId: myId }, { childId: myId }]
      });

      if (!result) {
        throw new HttpException(HttpStatusCodes.NOT_FOUND, "Conversation membership not found.");
      }

      res.status(HttpStatusCodes.OK).json({ success: true, message: "Conversation removed from recent chats" });
    } catch (error) { next(error); }
  };

  /**
   * Sync All: Initialize/Refresh chats for ALL existing programs and batches
   */
  public syncAllChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { ProgramModel } = await import('../Programs/program.model');
      const programs = await ProgramModel.find(); // even inactive ones just in case
      const batches = await BatchModel.find();

      let programCount = 0;
      let batchCount = 0;

      for (const p of programs) {
        await this.chatService.ensureProgramGroupExists(p._id.toString());
        programCount++;
      }

      // LEGACY CLEANUP: Delete old batch-wide groups that haven't been segmented
      const legacyGroups = await ConversationModel.find({
        type: 'GROUP',
        $or: [
          { scheduleId: { $exists: false } },
          { scheduleId: null },
          { ageGroup: { $exists: false } },
          { ageGroup: null }
        ]
      }).select('_id');

      if (legacyGroups.length > 0) {
        const legacyIds = legacyGroups.map(g => g._id);
        await ConversationModel.deleteMany({ _id: { $in: legacyIds } });
        await ConversationMemberModel.deleteMany({ conversationId: { $in: legacyIds } });
        console.log(`🧹 Cleanup: Deleted ${legacyIds.length} legacy batch groups and their member lists.`);
      }

      for (const b of batches) {
        await this.chatService.ensureBatchGroupExists(b._id.toString());
        batchCount++;
      }

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: `Chat Infrastructure Sync complete. Checked ${programCount} programs and ${batchCount} batches.`,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Toggle Pin for a conversation
   * Limit: Max 3 pins per user
   */
  public togglePin = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      console.log('📌 Toggle Pin Request:', { conversationId, myId });

      // Find the membership
      const membership = await ConversationMemberModel.findOne({
        conversationId,
        $or: [{ userId: myId }, { childId: myId }]
      });

      if (!membership) {
        console.error('❌ Membership not found for pin toggle');
        throw new HttpException(HttpStatusCodes.NOT_FOUND, "Conversation membership not found.");
      }

      console.log('✅ Current Pin Status:', membership.isPinned);

      // If pinning, check the 3-pin limit
      if (!membership.isPinned) {
        const { Types } = await import("mongoose");
        const pinCount = await ConversationMemberModel.countDocuments({
          $or: [
            { userId: new Types.ObjectId(myId.toString()) },
            { childId: new Types.ObjectId(myId.toString()) }
          ],
          isPinned: true
        });

        console.log(`📊 Pin Audit for ${myId}: Count is ${pinCount}`);

        if (pinCount >= 3) {
          console.warn('⚠️ Pin limit reached');
          throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Limit reached: You can pin up to 3 conversations.");
        }
      }

      membership.isPinned = !membership.isPinned;
      console.log('🔄 Toggling to:', membership.isPinned);
      
      const saved = await membership.save();
      console.log('💾 DB Save Result:', saved.isPinned);

      res.status(HttpStatusCodes.OK).json({ 
        success: true, 
        message: membership.isPinned ? "Chat Pinned" : "Chat Unpinned",
        isPinned: membership.isPinned 
      });
    } catch (error) { next(error); }
  };

  /**
   * Update a message (Edit)
   */
  public updateMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId, messageId } = req.params;
      const { text } = req.body;
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      const message = await MessageModel.findById(messageId);
      if (!message) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Message not found");

      // Check ownership or admin privilege
      const isOwner = (message.senderId?.toString() === myId.toString() || message.childId?.toString() === myId.toString());
      
      let canEdit = isOwner;
      if (!isOwner) {
        const { User: UserModel } = await import("../User/user.schema");
        const staff = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });
        canEdit = staff?.roles?.some((r: any) => 
          ['admin', 'super_admin', 'superadmin'].includes(r.code?.toLowerCase()) ||
          r.permissions?.some((p: any) => p.key === 'chat.edit.all')
        ) || false;
      }

      if (!canEdit) throw new HttpException(HttpStatusCodes.FORBIDDEN, "You do not have permission to edit this message.");

      message.text = text;
      message.isEdited = true;
      await message.save();

      const populatedMessage = await MessageModel.findById(message._id)
        .populate('senderId', 'firstname lastname avatar')
        .populate('childId', 'firstname lastname avatar')
        .populate({
           path: 'replyTo',
           populate: [
             { path: 'senderId', select: 'firstname lastname' },
             { path: 'childId', select: 'firstname lastname' }
           ]
        });

      broadcastMessageUpdate(conversationId, populatedMessage);

      res.status(HttpStatusCodes.OK).json({ success: true, data: populatedMessage });
    } catch (error) { next(error); }
  };

  /**
   * Delete a message
   */
  public deleteMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId, messageId } = req.params;
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      const message = await MessageModel.findById(messageId);
      if (!message) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Message not found");

      // 1. Ownership and Permission Check
      const isOwner = (message.senderId?.toString() === myId.toString() || message.childId?.toString() === myId.toString());
      
      let canDelete = false;
      const { User: UserModel } = await import("../User/user.schema");
      const staff = await UserModel.findById(myId).populate({ path: 'roles', populate: { path: 'permissions' } });

      const hasDeleteAll = staff?.roles?.some((r: any) => 
        ['admin', 'super_admin', 'superadmin'].includes(r.code?.toLowerCase()) ||
        r.permissions?.some((p: any) => p.key === 'chat.delete.all')
      );

      const hasDeleteOwn = isOwner && (tokenPayload.type === 'child' || staff?.roles?.some((r: any) => 
        r.permissions?.some((p: any) => p.key === 'chat.delete.own')
      ));

      canDelete = hasDeleteAll || hasDeleteOwn || false;

      if (!canDelete) throw new HttpException(HttpStatusCodes.FORBIDDEN, "You do not have permission to delete this message.");

      // 2. SOFT DELETE Implementation
      // We don't remove the record, we mark it deleted to maintain chat flow
      message.isDeleted = true;
      message.text = "This message was deleted";
      message.type = 'text';
      message.mediaUrl = undefined;
      message.fileName = undefined;
      message.fileSize = undefined;
      
      await message.save();

      // 3. Broadcast Update (not delete) so clients can show "Deleted" state
      broadcastMessageUpdate(conversationId, message);

      res.status(HttpStatusCodes.OK).json({ 
        success: true, 
        message: "Message deleted successfully",
        data: message 
      });
    } catch (error) { next(error); }
  };

  /**
   * Mark all messages in a conversation as read for the current user
   */
  public markAsRead = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { conversationId } = req.params;
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      // Ensure membership
      const membership = await ConversationMemberModel.findOne({
        conversationId,
        $or: [{ userId: myId }, { childId: myId }]
      });

      if (!membership) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, "Access Denied: You are not a member of this conversation.");
      }

      await MessageModel.updateMany(
        { 
          conversationId, 
          isReadBy: { $ne: myId },
          senderId: { $ne: myId },
          childId: { $ne: myId }
        },
        { $addToSet: { isReadBy: myId } }
      );

      // Broadcast the read event to all room members
      broadcastMessagesRead(conversationId, myId.toString());

      res.status(HttpStatusCodes.OK).json({ 
        success: true,
        message: "Messages marked as read" 
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get total sum of unread messages across all conversations
   */
  public getTotalUnreadCount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenPayload = (req as any).tokenPayload;
      const myId = tokenPayload._id;

      // Find all conversations the user is a member of
      const memberships = await ConversationMemberModel.find({
        $or: [{ userId: myId }, { childId: myId }]
      }).select('conversationId');

      const conversationIds = memberships.map(m => m.conversationId);

      const totalUnread = await MessageModel.countDocuments({
        conversationId: { $in: conversationIds },
        isReadBy: { $ne: myId },
        senderId: { $ne: myId },
        childId: { $ne: myId }
      });

      res.status(HttpStatusCodes.OK).json({ 
        success: true, 
        totalUnread 
      });
    } catch (error) {
      next(error);
    }
  };
}

