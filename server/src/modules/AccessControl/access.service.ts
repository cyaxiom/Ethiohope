import { IRole } from "@accessControll/role.model";
import { AccessDao } from "./access.dao";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { logger } from "@utils/logger";

const accessDao = new AccessDao();

export class AccessService {
  /**
   * Resolve role IDs to a unique set of permission keys
   */
  static async resolvePermissions(roleIds: string[]): Promise<Set<string>> {
    // Note: If you want to use the DAO instance method inside a static method, 
    // we either instantiate it locally or make DAO static. We'll use the local instance for simplicity.
    const roles = await accessDao.findRolesByIds(roleIds);
    const permissions = new Set<string>();

    for (const role of roles) {
      if (role.permissions) {
        (role.permissions as any).forEach((p: any) => {
          if (p && p.key) permissions.add(p.key);
        });
      }
    }
    return permissions;
  }

  /**
   * Get all permissions
   */
  public async getPermissions() {
    return await accessDao.findAllPermissions();
  }

  /**
   * Get all roles populated with permissions
   */
  public async getRoles(): Promise<IRole[]> {
    logger.info("Fetching all roles");
    return await accessDao.findAllRoles();
  }

  /**
   * Create a new role using permission keys
   */
  public async createRole(data: { name: string; code: string; permissionKeys: string[] }): Promise<IRole> {
    logger.info(`Validating permissions for new role: ${data.name}`);
    const permissions = await accessDao.findPermissionsByKeys(data.permissionKeys);

    if (permissions.length !== data.permissionKeys.length) {
      logger.error(`Failed to create role: ${data.name}. Invalid permission keys provided.`);
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "One or more permission keys are invalid");
    }

    logger.info(`Creating new role: ${data.name} with code: ${data.code}`);
    return await accessDao.createRole({
      name: data.name,
      code: data.code.toLowerCase().replace(/\s+/g, "_"),
      permissions: permissions.map(p => p._id),
      isSystem: false
    });
  }

  /**
   * Update role permissions by keys
   */
  public async updateRolePermissions(roleId: string, permissionKeys: string[]): Promise<IRole | null> {
    logger.info(`Updating permissions for role ID: ${roleId}`);
    const permissions = await accessDao.findPermissionsByKeys(permissionKeys);

    if (permissions.length !== permissionKeys.length) {
      logger.error(`Failed to update role ID: ${roleId}. Invalid permission keys provided.`);
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "One or more permission keys are invalid");
    }

    const updatedRole = await accessDao.updateRolePermissions(roleId, permissions.map(p => p._id));

    logger.info(`Successfully updated permissions for role ID: ${roleId}`);
    return updatedRole;
  }

  /**
   * Delete a role (System roles protected)
   */
  public async deleteRole(roleId: string, isAdminBypass: boolean = false): Promise<void> {
    logger.info(`Attempting to delete role ID: ${roleId}`);
    const role = await accessDao.findRoleById(roleId);

    if (!role) {
      logger.error(`Failed to delete role. Role ID ${roleId} not found.`);
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Role not found");
    }
    
    // Protect system roles UNLESS deleted by a Super Admin
    if (role.isSystem && !isAdminBypass) {
      logger.error(`Failed to delete role. Role ID ${roleId} is a system role.`);
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "System roles cannot be deleted via normal operations");
    }

    await accessDao.deleteRole(roleId);
    logger.info(`Successfully deleted role ID: ${roleId}`);
  }
}