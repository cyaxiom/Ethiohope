import { Router } from "express";
import { ChatController } from "./chat.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class ChatRoute implements Routes {
  public path = "/admin/chats";
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 0. Global Chat Settings
    this.router.get(
      `/settings`,
      authMiddleware as any,
      this.chatController.getChatSettings as any
    );

    this.router.patch(
      `/settings/direct`,
      authMiddleware as any,
      requirePermission("chat.direct.toggle") as any,
      this.chatController.updateDirectChatSettings as any
    );

    this.router.patch(
      `/settings/group`,
      authMiddleware as any,
      requirePermission("chat.group.toggle") as any,
      this.chatController.updateGroupChatSettings as any
    );

    // 1. List all program announcement groups
    this.router.get(
      `/programs`,
      authMiddleware as any,
      requirePermission("chat.read") as any,
      this.chatController.getProgramAnnouncementChats as any
    );

    // 1.1 List all batch discussion groups
    this.router.get(
      `/batches`,
      authMiddleware as any,
      requirePermission("chat.read") as any,
      this.chatController.getBatchChats as any
    );

    // 1.2 Force sync members for a chat
    this.router.post(
      `/:id/sync`,
      authMiddleware as any,
      requirePermission("chat.manage") as any,
      this.chatController.syncMembers as any
    );

    // 1.3 GLOBAL SYNC: Initialize all chats
    this.router.post(
      `/sync-all`,
      authMiddleware as any,
      requirePermission("chat.manage") as any,
      this.chatController.syncAllChats as any
    );



    // 2. Ensure/Create program group for a specific program
    this.router.post(
      `/programs/:programId/ensure`,
      authMiddleware as any,
      requirePermission("chat.manage") as any,
      this.chatController.ensureProgramChat as any
    );

    // 3. Update conversation details (Rename/Active status)
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("chat.manage") as any,
      this.chatController.updateConversation as any
    );

    // 4. Send a message
    this.router.post(
      `/:conversationId/messages`,
      authMiddleware as any,
      requirePermission("chat.write") as any,
      this.chatController.sendMessage as any
    );

    // 5. Get messages
    this.router.get(
      `/:conversationId/messages`,
      authMiddleware as any,
      requirePermission("chat.read") as any,
      this.chatController.getMessages as any
    );
  }
}
