import { RoleModel } from "@accessControll/role.model";
import { User } from "@modules/User/user.schema";
import { ChildModel } from "@modules/Child/child.model";
import { logger } from "@utils/logger";

export class DashboardService {
  /**
   * Get overall dashboard statistics
   */
  public async getStats() {
    logger.info("Fetching overall dashboard statistics");

    // Find role IDs for parents and instructors/teachers
    const [parentRole, instructorRole] = await Promise.all([
      RoleModel.findOne({ code: 'parent' }),
      RoleModel.findOne({ code: 'instructor' })
    ]);

    // Efficiently count roles, total users, active users, parents, and teachers
    const [totalRoles, totalUsers, activeUsers, totalParents, totalTeachers] = await Promise.all([
      RoleModel.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      parentRole ? User.countDocuments({ roles: parentRole._id }) : 0,
      instructorRole ? User.countDocuments({ roles: instructorRole._id }) : 0
    ]);

    return {
      totalRoles,
      totalUsers,
      activeUsers,
      totalParents,
      totalTeachers
    };
  }

  /**
   * Get all parents with their children
   */
  public async getParentsWithChildren() {
    logger.info("Fetching parents with their children for dashboard");

    const parentRole = await RoleModel.findOne({ code: 'parent' });
    if (!parentRole) {
      return [];
    }

    // Find all users with parent role
    const parents = await User.find({ roles: parentRole._id })
      .select('firstname lastname email phone parentType status')
      .lean();

    // For each parent, find their children
    const parentsWithChildren = await Promise.all(
      parents.map(async (parent) => {
        const children = await ChildModel.find({ parent: parent._id })
          .select('firstname lastname grade birthdate gender status')
          .lean();
        return {
          ...parent,
          children
        };
      })
    );

    return parentsWithChildren;
  }

  /**
   * Get all instructors/teachers
   */
  public async getInstructors() {
    logger.info("Fetching instructors for dashboard");

    const instructorRole = await RoleModel.findOne({ code: 'instructor' });
    if (!instructorRole) {
      return [];
    }

    // Find all users with instructor role
    const instructors = await User.find({ roles: instructorRole._id })
      .select('firstname lastname email phone status lastLogin')
      .lean();

    return instructors;
  }
}
