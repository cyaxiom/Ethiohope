import { PermissionModel, PERMISSIONS } from './permission.model';
import { RoleModel, ROLES } from './role.model';
import { logger } from '@utils/logger';

export const seedPermissions = async () => {
  logger.info('🌱 Seeding permissions...', { module: 'AccessControl' });
  for (const perm of PERMISSIONS) {
    await PermissionModel.updateOne(
      { key: perm.key },
      { ...perm, isSystem: true },
      { upsert: true }
    );
  }
};

export const seedRoles = async () => {
  logger.info('🌱 Seeding roles...', { module: 'AccessControl' });
  const allPermissions = await PermissionModel.find();

  for (const role of ROLES) {
    let permissionIds;

    if (role.permissions === '*') {
      permissionIds = allPermissions.map(p => p._id);
    } else {
      const perms = await PermissionModel.find({
        key: { $in: role.permissions }
      });

      permissionIds = perms.map(p => p._id);
    }

    const existingRole = await RoleModel.findOne({ code: role.code });

    if (!existingRole) {
      await RoleModel.create({
        name: role.name,
        code: role.code,
        permissions: permissionIds,
        isSystem: true,
      });
      logger.info(`✅ Created system role: ${role.code}`);
    } else if (role.code === 'super_admin') {
      // Special case: Ensure Super Admin always has all permissions
      existingRole.permissions = permissionIds;
      await existingRole.save();
      logger.info(`✅ Updated system role: super_admin (synced all permissions)`);
    } else {
      logger.info(`ℹ️ Role ${role.code} already exists, skipping update to preserve custom changes.`);
    }
  }
};

export const runSeed = async () => {
  try {
    logger.info('🚀 Starting AccessControl database seed runner...');
    await seedPermissions();
    await seedRoles();
    logger.info('✅ Database seeding finished successfully!');
  } catch (error) {
    logger.error(`❌ Error during Database seeding: ${error}`);
  }
};
