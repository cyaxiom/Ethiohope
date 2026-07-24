import { RoleModel, IRole } from "@accessControll/role.model";
import { PermissionModel, IPermission } from "@accessControll/permission.model";
import { Types } from "mongoose";

export class AccessDao {
  /**
   * Find roles by an array of IDs, populated with permissions
   */
  public async findRolesByIds(roleIds: string[]): Promise<IRole[]> {
    return await RoleModel.find({ _id: { $in: roleIds } }).populate("permissions");
  }

  /**
   * Find a role by ID
   */
  public async findRoleById(roleId: string): Promise<IRole | null> {
    return await RoleModel.findById(roleId);
  }

  /**
   * Get all permissions
   */
  public async findAllPermissions(): Promise<IPermission[]> {
    return await PermissionModel.find();
  }

  /**
   * Get all roles populated with permissions
   */
  public async findAllRoles(): Promise<IRole[]> {
    return await RoleModel.find().populate("permissions");
  }

  /**
   * Find permissions based on an array of keys
   */
  public async findPermissionsByKeys(permissionKeys: string[]): Promise<IPermission[]> {
    return await PermissionModel.find({ key: { $in: permissionKeys } });
  }

  /**
   * Create a new role
   */
  public async createRole(data: { name: string; code: string; permissions: any[]; isSystem: boolean }): Promise<IRole> {
    return await RoleModel.create(data);
  }

  /**
   * Update role permissions
   */
  public async updateRolePermissions(roleId: string, permissionIds: any[]): Promise<IRole | null> {
    return await RoleModel.findByIdAndUpdate(
      roleId,
      { $set: { permissions: permissionIds } },
      { new: true }
    ).populate("permissions");
  }

  /**
   * Delete a role
   */
  public async deleteRole(roleId: string): Promise<IRole | null> {
    return await RoleModel.findByIdAndDelete(roleId);
  }
}
