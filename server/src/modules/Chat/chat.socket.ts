import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_PRIVATE_KEY } from '@config/env';
import { ConversationMemberModel } from './chat.model';
import { User } from '../User/user.schema';
import { ChildModel } from '../Child/child.model';
import { logger } from '@utils/logger';

let io: Server | null = null;

/**
 * Initialize Socket.io on the existing HTTP server.
 * Called once from server.ts after the server starts listening.
 */
export function initializeChatSocket(httpServer: HttpServer, allowedOrigins: string[]): Server {
  io = new Server(httpServer, {
    cors: {
      origin: allowedOrigins,
      credentials: true,
    },
    path: '/socket.io',
  });

  /**
   * Helper to update user presence in DB and notify peers
   */
  async function updatePresence(userId: string, userType: string, isOnline: boolean) {
    try {
      const Model: any = userType === 'child' ? ChildModel : User;
      const lastSeen = isOnline ? undefined : new Date();
      
      await Model.findByIdAndUpdate(userId, { 
        isOnline, 
        ...(lastSeen ? { lastSeen } : {}) 
      });

      // Broadcast presence change to all rooms this user is in
      const memberships = await ConversationMemberModel.find({
        $or: [{ userId }, { childId: userId }]
      }).select('conversationId');

      memberships.forEach(m => {
        io?.to(m.conversationId.toString()).emit('user-presence', {
          userId,
          isOnline,
          lastSeen: lastSeen || null
        });
      });
    } catch (err) {
      logger.error('Error updating presence:', err);
    }
  }

  // Authentication middleware — verify JWT before allowing connection
  io.use(async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth?.token || socket.handshake.query?.token;
      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const payload = verify(token as string, ACCESS_TOKEN_PRIVATE_KEY as string) as any;
      (socket as any).userId = payload._id;
      (socket as any).userType = payload.type; // 'adult' | 'child'
      next();
    } catch (err) {
      logger.error('Socket auth failed:', err);
      next(new Error('Invalid authentication token'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    const userId = (socket as any).userId;
    const userType = (socket as any).userType;
    logger.info(`🔌 Socket connected: ${userId} (${socket.id})`);
    
    // Check if this is the user's first connection (tab)
    const userSockets = io?.sockets.adapter.rooms.get(userId);
    if (!userSockets || userSockets.size === 0) {
      await updatePresence(userId, userType, true);
    }

    socket.join(userId); // Join personal room for individual notifications

    // Auto-join all conversation rooms this user belongs to
    try {
      const memberships = await ConversationMemberModel.find({
        $or: [{ userId }, { childId: userId }]
      }).select('conversationId');

      for (const m of memberships) {
        const roomId = m.conversationId.toString();
        socket.join(roomId);
      }
      logger.info(`User ${userId} joined ${memberships.length} chat rooms`);
    } catch (err) {
      logger.error(`Failed to join rooms for user ${userId}:`, err);
    }

    // Handle manual room join (e.g. when navigating to a new chat)
    socket.on('join-room', (conversationId: string) => {
      socket.join(conversationId);
    });

    // Handle typing indicators
    socket.on('typing', (data: { conversationId: string; isTyping: boolean }) => {
      socket.to(data.conversationId).emit('user-typing', {
        userId,
        conversationId: data.conversationId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', async () => {
      logger.info(`🔌 Socket disconnected: ${userId} (${socket.id})`);
      
      // Check if this was the user's last active connection
      const remainingSockets = io?.sockets.adapter.rooms.get(userId);
      if (!remainingSockets || remainingSockets.size === 0) {
        await updatePresence(userId, userType, false);
      }
    });
  });

  logger.info('🔌 Socket.io initialized for real-time chat');
  return io;
}

/**
 * Broadcast a new message to all members of a conversation room.
 * Called from ChatController.sendMessage after the message is saved.
 */
export function broadcastMessage(conversationId: string, message: any): void {
  if (io) {
    logger.info(`📢 Socket: Broadcasting new-message to room ${conversationId}`);
    io.to(conversationId).emit('new-message', {
      conversationId,
      message,
    });
  } else {
    logger.error('❌ Socket: Cannot broadcast, io is null');
  }
}

/**
 * Notifies specific users that they've been added to a new conversation
 */
export function notifyNewConversation(userIds: string[], conversation: any): void {
  if (io) {
    logger.info(`🔔 Socket: Notifying users of new conversation: ${userIds.join(', ')}`);
    userIds.forEach(uid => {
      io?.to(uid.toString()).emit('added-to-conversation', { conversation });
    });
  } else {
    logger.error('❌ Socket: Cannot notify, io is null');
  }
}

/**
 * Broadcast message update to all members of a conversation room.
 */
export function broadcastMessageUpdate(conversationId: string, message: any): void {
  if (io) {
    logger.info(`📢 Socket: Broadcasting message-updated to room ${conversationId}`);
    io.to(conversationId).emit('message-updated', {
      conversationId,
      message,
    });
  }
}

/**
 * Broadcast message deletion to all members of a conversation room.
 */
export function broadcastMessageDelete(conversationId: string, messageId: string): void {
  if (io) {
    logger.info(`📢 Socket: Broadcasting message-deleted to room ${conversationId}`);
    io.to(conversationId).emit('message-deleted', {
      conversationId,
      messageId,
    });
  }
}

/**
 * Broadcast that messages in a conversation have been read by a user.
 */
export function broadcastMessagesRead(conversationId: string, userId: string): void {
  if (io) {
    logger.info(`📢 Socket: Broadcasting messages-read to room ${conversationId}`);
    io.to(conversationId).emit('messages-read', {
      conversationId,
      readerId: userId,
    });
  }
}

/**
 * Get the Socket.io server instance (for use in other modules)
 */
export function getIO(): Server | null {
  return io;
}
