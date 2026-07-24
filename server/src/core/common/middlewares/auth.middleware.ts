import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { ACCESS_TOKEN_PRIVATE_KEY } from '@config/env';
import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { ITokenPayload } from '@common/Token/token.interface';
import { RoleModel } from '@modules/AccessControl/role.model';
import { RequestWithTokenPayload } from '@modules/Authentication/auth.interface';
import { User } from '@modules/User/user.schema';

/**
 * Authentication Middleware: Verifies the JWT and attaches the payload to the request
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header('Authorization');
    const Authorization = req.cookies['Authorization'] ||
      (authHeader ? (authHeader.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : authHeader) : null);

    if (Authorization) {
      const verificationResponse = verify(Authorization, ACCESS_TOKEN_PRIVATE_KEY as string) as ITokenPayload;
      (req as RequestWithTokenPayload).tokenPayload = verificationResponse;
      next();
    } else {
      next(new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Authentication token missing'));
    }
  } catch (error) {
    next(new HttpException(HttpStatusCodes.UNAUTHORIZED, 'Wrong authentication token'));
  }
};

/**
 * Authorization Middleware: Checks if the user has the required permission key.
 * This is strictly permission-based RBAC.
 */
export const requirePermission = (permissionKey: string) => {
  return async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const userPayload = req.tokenPayload;
      if (!userPayload) {
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      // 1. Fetch current role IDs
      let roleIds: any[] = [];
      
      if (userPayload.type === 'child') {
        // Children currently have implicit roles stored in the token
        roleIds = (userPayload as any).role || [];
      } else {
        // Adults have roles stored in the User document
        const user = await User.findById(userPayload._id);
        roleIds = user?.roles || [];
      }
      
      if (!roleIds || roleIds.length === 0) {
        throw new HttpException(HttpStatusCodes.FORBIDDEN, 'No roles assigned to user');
      }

      // 2. Fetch Roles and populate their Permissions
      const roles = await RoleModel.find({ _id: { $in: roleIds } }).populate('permissions');

      const userPermissions = new Set<string>();
      let isSuperAdmin = false;

      roles.forEach(role => {
        // Normalize role code for comparison
        const roleCode = role.code?.toLowerCase();
        
        // Recognize both standard and common manual superadmin codes
        if (roleCode === 'super_admin' || roleCode === 'superadmin') {
          isSuperAdmin = true;
        }

        if (role.permissions) {
          (role.permissions as any).forEach((p: any) => {
            if (p && p.key) {
              userPermissions.add(p.key);
            }
          });
        }
      });

      // 3. Super Admin Bypass
      // Super admins skip all individual permission checks.
      if (isSuperAdmin) {
        return next();
      }

      // 4. Permission Check
      // We check for the specific KEY, not the ROLE name.
      if (userPermissions.has(permissionKey)) {
        return next();
      }

      // 5. Block Unauthorized Access
      console.warn(`[RBAC] Access Denied. User ${userPayload._id} lacks permission: ${permissionKey}`);
      throw new HttpException(
        HttpStatusCodes.FORBIDDEN,
        `Access Denied: Missing required permission [${permissionKey}]`
      );
    } catch (error) {
      next(error);
    }
  };
};

import { ChildModel } from '@modules/Child/child.model';

/**
 * ABAC Middleware: Validates ownership of a resource.
 * Example: A parent can only access their own children.
 */
export const requireOwnership = (resourceType: 'child') => {
  return async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const userPayload = req.tokenPayload;
      if (!userPayload) {
        throw new HttpException(HttpStatusCodes.UNAUTHORIZED, 'User not authenticated');
      }

      const resourceId = req.params.id;
      if (!resourceId) {
        return next(); // Nothing to check ownership for
      }

      // 1. Super Admin Bypass (Industry standard exception)
      // Super admins skip ownership checks as they need global access.
      let roleIds: any[] = [];
      if (userPayload.type === 'child') {
        roleIds = (userPayload as any).role || [];
      } else {
        const user = await User.findById(userPayload._id);
        roleIds = user?.roles || [];
      }
      
      const roles = await RoleModel.find({ _id: { $in: roleIds } });
      const isSuperAdmin = roles.some(role => {
        const code = role.code?.toLowerCase();
        return code === 'super_admin' || code === 'superadmin';
      });

      if (isSuperAdmin) {
        return next();
      }

      // 2. Attribute-Based Check (ABAC)
      if (resourceType === 'child') {
        const child = await ChildModel.findById(resourceId);
        if (!child) {
          throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found');
        }

        // Validate the relationship attribute: child.parent === currentUserId
        if (child.parent.toString() !== userPayload._id.toString()) {
          console.warn(`[ABAC Denied] User ${userPayload._id} attempted unauthorized access to child ${resourceId}`);
          throw new HttpException(
            HttpStatusCodes.FORBIDDEN,
            'Access Denied: This profile does not belong to your account'
          );
        }
      }

      // If all checks pass
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Legacy Alias for checkPermission (mapping to requirePermission)
 */
export const checkPermission = requirePermission;
