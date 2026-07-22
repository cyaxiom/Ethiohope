import { Schema, model, Document } from 'mongoose';

export interface IPermission extends Document {
  key: string;           // course.update, student.read
  resource: string;      // course, student
  action: string;        // create, read, update, delete
  description?: string;
  isSystem?: boolean;    // protected permission
}

const PermissionSchema = new Schema<IPermission>(
  {
    key: { type: String, required: true, unique: true },
    resource: { type: String, required: true },
    action: { type: String, required: true },
    description: String,
    isSystem: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const PermissionModel = model<IPermission>(
  'Permission',
  PermissionSchema
);

// DEFINE DEFAULT PERMISSIONS (Single Source of Truth)
export const PERMISSIONS = [
  // USER
  { key: 'user.create', resource: 'user', action: 'create' },
  { key: 'user.read', resource: 'user', action: 'read' },
  { key: 'user.update', resource: 'user', action: 'update' },
  { key: 'user.delete', resource: 'user', action: 'delete' },

  // CHILD
  { key: 'child.create', resource: 'child', action: 'create' },
  { key: 'child.read', resource: 'child', action: 'read' },
  { key: 'child.update', resource: 'child', action: 'update' },
  { key: 'child.delete', resource: 'child', action: 'delete' },

  // DASHBOARD ACCESS
  { key: 'dashboard.admin', resource: 'dashboard', action: 'admin' },
  { key: 'dashboard.parent', resource: 'dashboard', action: 'parent' },
  { key: 'dashboard.student', resource: 'dashboard', action: 'student' },
  { key: 'dashboard.instructor', resource: 'dashboard', action: 'instructor' },
  { key: 'dashboard.child', resource: 'dashboard', action: 'child' },

  // ROLES
  { key: 'role.create', resource: 'role', action: 'create' },
  { key: 'role.read', resource: 'role', action: 'read' },
  { key: 'role.update', resource: 'role', action: 'update' },
  { key: 'role.delete', resource: 'role', action: 'delete' },

  // PROGRAM
  { key: 'program.create', resource: 'program', action: 'create' },
  { key: 'program.read', resource: 'program', action: 'read' },
  { key: 'program.update', resource: 'program', action: 'update' },
  { key: 'program.delete', resource: 'program', action: 'delete' },

  // PHASE
  { key: 'phase.create', resource: 'phase', action: 'create' },
  { key: 'phase.read', resource: 'phase', action: 'read' },
  { key: 'phase.update', resource: 'phase', action: 'update' },
  { key: 'phase.delete', resource: 'phase', action: 'delete' },

  // BATCH
  { key: 'batch.create', resource: 'batch', action: 'create' },
  { key: 'batch.read', resource: 'batch', action: 'read' },
  { key: 'batch.update', resource: 'batch', action: 'update' },
  { key: 'batch.delete', resource: 'batch', action: 'delete' },

  // SCHEDULE
  { key: 'schedule.create', resource: 'schedule', action: 'create' },
  { key: 'schedule.read', resource: 'schedule', action: 'read' },
  { key: 'schedule.update', resource: 'schedule', action: 'update' },
  { key: 'schedule.delete', resource: 'schedule', action: 'delete' },

  // PAYMENT
  { key: 'payment.read', resource: 'payment', action: 'read' },
  { key: 'payment.update', resource: 'payment', action: 'update' },
  { key: 'payment.delete', resource: 'payment', action: 'delete' },

  // COURSE
  { key: 'course.read', resource: 'course', action: 'read' },
  { key: 'course.create', resource: 'course', action: 'create' },
  { key: 'course.update', resource: 'course', action: 'update' },
  { key: 'course.delete', resource: 'course', action: 'delete' },
  
  // PROGRESS
  { key: 'progress.read', resource: 'progress', action: 'read' },
  { key: 'progress.update', resource: 'progress', action: 'update' },

  // SESSION
  { key: 'session.create', resource: 'session', action: 'create' },
  { key: 'session.read', resource: 'session', action: 'read' },
  { key: 'session.update', resource: 'session', action: 'update' },
  { key: 'session.delete', resource: 'session', action: 'delete' },

  // CHAT
  { key: 'chat.read', resource: 'chat', action: 'Manage Group Directory' },
  { key: 'chat.write', resource: 'chat', action: 'Send Messages' },
  { key: 'chat.broadcast', resource: 'chat', action: 'Post Announcements' },
  { key: 'chat.reply', resource: 'chat', action: 'Allow Replies' },
  { key: 'chat.react', resource: 'chat', action: 'Allow Reactions' },
  { key: 'chat.delete.own', resource: 'chat', action: 'Delete Own Messages' },
  { key: 'chat.delete.all', resource: 'chat', action: 'Delete Any Message (Admin)' },
  { key: 'chat.read.all', resource: 'chat', action: 'Monitor All Private Messages' },
  { key: 'chat.direct.start', resource: 'chat', action: 'Start Private Chats' },
  { key: 'chat.direct.search.all', resource: 'chat', action: 'Global Search' },
  { key: 'chat.direct.toggle', resource: 'chat', action: 'Enable/Disable Direct Chat' },
  { key: 'chat.group.toggle', resource: 'chat', action: 'Enable/Disable Group Chat' },
  { key: 'chat.edit.own', resource: 'chat', action: 'Edit Own Messages' },
  { key: 'chat.edit.all', resource: 'chat', action: 'Edit Any Message' },
  { key: 'user.detail.view', resource: 'user', action: 'view details' },
  { key: 'system.reset', resource: 'system', action: 'reset' },
];
