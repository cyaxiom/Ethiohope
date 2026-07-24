import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

const getDefaultDashboardPath = (roles: string[], activeRole: string | null) => {
  const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);
  if (currentRole === 'admin' || currentRole === 'super_admin') return '/admin/dashboard';
  if (currentRole === 'instructor') return '/instructor/dashboard';
  if (currentRole === 'parent') return '/parent/dashboard';
  if (currentRole === 'student' || currentRole === 'child') return '/student/courses';
  return '/';
};

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
 * Blocks authenticated users from guest-only pages (login, register, etc.).
 */
export const GuestRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, token, roles, activeRole } = useSelector((state: RootState) => state.auth);

  if (isAuthenticated && token) {
    return <Navigate to={getDefaultDashboardPath(roles, activeRole)} replace />;
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
  requiredPermissions = [],
}) => {
  const { roles, activeRole, permissions, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const currentRole = activeRole || (roles.length > 0 ? roles[0] : null);
  const hasRole = allowedRoles.length === 0 || (currentRole && allowedRoles.includes(currentRole));
  const hasPermission =
    requiredPermissions.length === 0 ||
    requiredPermissions.some((perm: string) => permissions.includes(perm));

  if (allowedRoles.length > 0 && !hasRole) {
    return <Navigate to="/forbidden" replace />;
  }

  if (!hasRole && !hasPermission) {
    return <Navigate to="/forbidden" replace />;
  }

  return <>{children}</>;
};
