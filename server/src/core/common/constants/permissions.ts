export const PERMISSIONS = {
  STUDENT_VIEW: 'student:view',
  STUDENT_CREATE: 'student:create',
  STUDENT_UPDATE: 'student:update',
  STUDENT_DELETE: 'student:delete',

  CLASS_VIEW: 'class:view',
  CLASS_CREATE: 'class:create',
  CLASS_UPDATE: 'class:update',

  TRANSACTION_VIEW: 'transaction:view',
  TRANSACTION_APPROVE: 'transaction:approve',

  SYSTEM_MANAGE_ROLES: 'system:manage-roles',
} as const;

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);
