import { Router } from "express";
import { ChatController } from "./chat.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware } from "@common/middlewares/auth.middleware";

/**
 * Unified Chat Route — accessible by ALL authenticated users (Admin, Instructor, Student/Parent).
 * Path: /api/v1/chats
 *
 * This route provides:
 * - GET /my-chats       → Returns only chats the authenticated user is a member of
 * - GET /:id/messages   → Returns messages for a conversation (membership verified)
 * - POST /:id/messages  → Send a message (broadcast rules enforced for PROGRAM_GROUP)
 */
export class ChatCommonRoute implements Routes {
  public path = "/chats";
  public router = Router();
  public chatController = new ChatController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 0. Search users for direct chat
    this.router.get(
      `/search-users`,
      authMiddleware as any,
      this.chatController.searchUsers as any
    );

    // 0.1 Start or find direct chat
    this.router.post(
      `/direct`,
      authMiddleware as any,
      this.chatController.startDirectChat as any
    );

    // 0.2 Get settings (to check if direct chat is enabled)
    this.router.get(
      `/settings`,
      authMiddleware as any,
      this.chatController.getChatSettings as any
    );

    // 1. Get all chats the current user belongs to
    this.router.get(
      `/my-chats`,
      authMiddleware as any,
      this.chatController.getMyChats as any
    );

    // 1.1 Get total unread messages count
    this.router.get(
      `/unread-count`,
      authMiddleware as any,
      this.chatController.getTotalUnreadCount as any
    );

    // 2. Get messages for a specific conversation (membership is verified inside)
    this.router.get(
      `/:conversationId/messages`,
      authMiddleware as any,
      this.chatController.getMessages as any
    );

    // 3. Send a message (broadcast rules enforced inside controller)
    this.router.post(
      `/:conversationId/messages`,
      authMiddleware as any,
      this.chatController.sendMessage as any
    );

    // 3.1 Mark conversation as read
    this.router.post(
      `/:conversationId/read`,
      authMiddleware as any,
      this.chatController.markAsRead as any
    );

    // 4. React to a message
    this.router.post(
      `/:conversationId/messages/:messageId/react`,
      authMiddleware as any,
      this.chatController.reactToMessage as any
    );

    // 5. Toggle Pin
    this.router.patch(
      `/:conversationId/pin`,
      authMiddleware as any,
      this.chatController.togglePin as any
    );

    // 6. Push message update (Edit)
    this.router.patch(
      `/:conversationId/messages/:messageId`,
      authMiddleware as any,
      this.chatController.updateMessage as any
    );

    // 7. Delete message
    this.router.delete(
      `/:conversationId/messages/:messageId`,
      authMiddleware as any,
      this.chatController.deleteMessage as any
    );

    // 8. Remove conversation from recent chats
    this.router.delete(
      `/:conversationId`,
      authMiddleware as any,
      this.chatController.removeConversation as any
    );
  }
}
