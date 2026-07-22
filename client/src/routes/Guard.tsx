import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

/**
 * Component to protect routes that require authentication.
 */
export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token } = useSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

/**
 * Component to protect routes based on roles or permissions.
 */
interface PermissionRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
  requiredPermissions?: string[];
}

export const PermissionRoute: React.FC<PermissionRouteProps> = ({ 
  children, 
  allowedRoles = [], 
  requiredPermissions = [] 
}) => {
  const { roles, activeRole, permissions, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check roles using activeRole
  const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);
  const hasRole = allowedRoles.length === 0 || (currentRole && allowedRoles.includes(currentRole));
  
  // Check permissions (Note: permissions in state may be a merged list of all roles)
  const hasPermission = requiredPermissions.length === 0 || requiredPermissions.some((perm: string) => permissions.includes(perm));

  // If the route specifically restricts by role, and the active role doesn't match, block access.
  if (allowedRoles.length > 0 && !hasRole) {
    return <Navigate to="/forbidden" replace />;
  }

  // Otherwise, fallback to the original check
  if (!hasRole && !hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
