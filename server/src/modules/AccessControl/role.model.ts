import { Schema, model, Document, Types } from 'mongoose';

export interface IRole extends Document {
  name: string;                 // ADMIN, TEACHER
  code: string;                 // admin, teacher
  permissions: Types.ObjectId[];
  description?: string;
  isSystem?: boolean;
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    permissions: [
      { type: Schema.Types.ObjectId, ref: 'Permission' }
    ],
    description: String,
    isSystem: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const RoleModel = model<IRole>('Role', RoleSchema);

// DEFINE DEFAULT ROLES (Static Config)
// We only seed SUPER_ADMIN statically. 
// All other roles (ADMIN, INSTRUCTOR, etc.) will be created dynamically via CRUD in the UI!
export const ROLES = [
  {
    name: 'SUPER ADMIN',
    code: 'super_admin',
    permissions: '*', // wildcard for all permissions
  },
  {
    name: 'USER',
    code: 'user',
    permissions: [], // basic user permissions
  },
  {
    name: 'PARENT',
    code: 'parent',
    permissions: [
      'dashboard.parent', 
      'child.read', 
      'progress.read', 
      'payment.read',
      'chat.write', 
      'chat.direct.start', 
      'chat.edit.own', 
      'chat.react', 
      'chat.reply'
    ],
  },
  {
    name: 'CHILD',
    code: 'child',
    permissions: [
      'dashboard.student', 
      'course.read', 
      'progress.read', 
      'progress.update', 
      'dashboard.child',
      'chat.write', 
      'chat.direct.start', 
      'chat.edit.own', 
      'chat.react', 
      'chat.reply'
    ],
  },
  {
    name: 'STUDENT',
    code: 'student',
    permissions: [
      'dashboard.student',
      'course.read',
      'progress.read',
      'progress.update',
      'chat.write',
      'chat.direct.start',
      'chat.edit.own',
      'chat.react',
      'chat.reply',
    ],
  },
];
