/**
 * RBAC Helper Utilities
 * 
 * Permission-based access control helpers.
 * NEVER check role names like "ADMIN" — always use permission keys.
 */

/**
 * Check if a user has a specific permission
 */
export function hasPermission(permissions: string[], permissionKey: string): boolean {
  return permissions.includes(permissionKey);
}

/**
 * Check if a user has ALL of the specified permissions
 */
export function hasAllPermissions(permissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.every((perm) => permissions.includes(perm));
}

/**
 * Check if a user has ANY of the specified permissions
 */
export function hasAnyPermission(permissions: string[], requiredPermissions: string[]): boolean {
  return requiredPermissions.some((perm) => permissions.includes(perm));
}
