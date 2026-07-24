import { RoleModel } from "@accessControll/role.model";
import { User } from "@modules/User/user.schema";
import { ChildModel } from "@modules/Child/child.model";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { logger } from "@utils/logger";
import { Types } from "mongoose";

export class DashboardService {
  /**
   * Get overall dashboard statistics
   */
  public async getStats() {
    logger.info("Fetching overall dashboard statistics");

    const [parentRole, instructorRole, studentRole] = await Promise.all([
      RoleModel.findOne({ code: 'parent' }),
      RoleModel.findOne({ code: 'instructor' }),
      RoleModel.findOne({ code: 'student' }),
    ]);

    const [
      totalRoles,
      totalUsers,
      activeUsers,
      totalParents,
      totalTeachers,
      totalChildren,
      totalAdultStudents,
      pendingEnrollments,
      activeEnrollments,
    ] = await Promise.all([
      RoleModel.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
      parentRole ? User.countDocuments({ roles: parentRole._id }) : 0,
      instructorRole ? User.countDocuments({ roles: instructorRole._id }) : 0,
      ChildModel.countDocuments(),
      studentRole ? User.countDocuments({ roles: studentRole._id }) : 0,
      EnrollmentModel.countDocuments({ status: 'PENDING' }),
      EnrollmentModel.countDocuments({ status: 'ACTIVE' }),
    ]);

    return {
      totalRoles,
      totalUsers,
      activeUsers,
      totalParents,
      totalTeachers,
      totalChildren,
      totalAdultStudents,
      pendingEnrollments,
      activeEnrollments,
    };
  }

  private matchesSearch(haystacks: Array<string | undefined | null>, search?: string): boolean {
    if (!search?.trim()) return true;
    const q = search.trim().toLowerCase();
    return haystacks.some((h) => (h || '').toLowerCase().includes(q));
  }

  /**
   * Get all parents with their children (+ light enrollment counts)
   */
  public async getParentsWithChildren(search?: string) {
    logger.info("Fetching parents with their children for dashboard");

    const parentRole = await RoleModel.findOne({ code: 'parent' });
    if (!parentRole) {
      return [];
    }

    const parents = await User.find({ roles: parentRole._id })
      .select('firstname lastname email phone parentType status createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const parentsWithChildren = await Promise.all(
      parents.map(async (parent) => {
        const children = await ChildModel.find({ parent: parent._id })
          .select('firstname lastname username grade birthdate gender status isUSA country region')
          .lean();

        const childIds = children.map((c) => c._id);
        const [parentEnrollmentCount, pendingCount] = await Promise.all([
          EnrollmentModel.countDocuments({
            $or: [
              { parent: parent._id },
              { child: { $in: childIds } },
            ],
          }),
          EnrollmentModel.countDocuments({
            $or: [
              { parent: parent._id, status: 'PENDING' },
              { child: { $in: childIds }, status: 'PENDING' },
            ],
          }),
        ]);

        return {
          ...parent,
          children,
          enrollmentCount: parentEnrollmentCount,
          pendingEnrollmentCount: pendingCount,
        };
      })
    );

    if (!search?.trim()) return parentsWithChildren;

    return parentsWithChildren.filter((p) => {
      const childHit = p.children.some((c: any) =>
        this.matchesSearch([c.firstname, c.lastname, c.username], search)
      );
      return (
        childHit ||
        this.matchesSearch([p.firstname, p.lastname, p.email, p.phone], search)
      );
    });
  }

  /**
   * Flat directory of all child/student accounts with parent info
   */
  public async getChildrenDirectory(search?: string) {
    logger.info("Fetching children directory for dashboard");

    const children = await ChildModel.find()
      .select('firstname lastname username grade birthdate gender status isUSA country region parent createdAt')
      .populate('parent', 'firstname lastname email phone status')
      .sort({ createdAt: -1 })
      .lean();

    const withCounts = await Promise.all(
      children.map(async (child) => {
        const [enrollmentCount, pendingCount, activeCount] = await Promise.all([
          EnrollmentModel.countDocuments({ child: child._id }),
          EnrollmentModel.countDocuments({ child: child._id, status: 'PENDING' }),
          EnrollmentModel.countDocuments({ child: child._id, status: 'ACTIVE' }),
        ]);
        return {
          ...child,
          enrollmentCount,
          pendingEnrollmentCount: pendingCount,
          activeEnrollmentCount: activeCount,
        };
      })
    );

    if (!search?.trim()) return withCounts;

    return withCounts.filter((c: any) =>
      this.matchesSearch(
        [
          c.firstname,
          c.lastname,
          c.username,
          c.parent?.firstname,
          c.parent?.lastname,
          c.parent?.email,
        ],
        search
      )
    );
  }

  /**
   * Adult student accounts (self-enrolled adults)
   */
  public async getAdultStudents(search?: string) {
    logger.info("Fetching adult students for dashboard");

    const studentRole = await RoleModel.findOne({ code: 'student' });
    if (!studentRole) return [];

    const users = await User.find({ roles: studentRole._id })
      .select('firstname lastname email phone status lastLogin createdAt')
      .sort({ createdAt: -1 })
      .lean();

    const withCounts = await Promise.all(
      users.map(async (user) => {
        const [enrollmentCount, pendingCount, activeCount] = await Promise.all([
          EnrollmentModel.countDocuments({
            $or: [{ user: user._id }, { enrolleeType: 'SELF', user: user._id }],
          }),
          EnrollmentModel.countDocuments({ user: user._id, status: 'PENDING' }),
          EnrollmentModel.countDocuments({ user: user._id, status: 'ACTIVE' }),
        ]);
        return {
          ...user,
          enrollmentCount,
          pendingEnrollmentCount: pendingCount,
          activeEnrollmentCount: activeCount,
        };
      })
    );

    if (!search?.trim()) return withCounts;
    return withCounts.filter((u) =>
      this.matchesSearch([u.firstname, u.lastname, u.email, u.phone], search)
    );
  }

  /**
   * Get all instructors/teachers
   */
  public async getInstructors(search?: string) {
    logger.info("Fetching instructors for dashboard");

    const instructorRole = await RoleModel.findOne({ code: 'instructor' });
    if (!instructorRole) {
      return [];
    }

    const instructors = await User.find({ roles: instructorRole._id })
      .select('firstname lastname email phone status lastLogin createdAt')
      .sort({ createdAt: -1 })
      .lean();

    if (!search?.trim()) return instructors;
    return instructors.filter((t) =>
      this.matchesSearch([t.firstname, t.lastname, t.email, t.phone], search)
    );
  }

  /**
   * Compact enrollment rows for a person (parent / child / adult student)
   */
  public async getPersonEnrollments(params: {
    parentId?: string;
    childId?: string;
    userId?: string;
  }) {
    const filter: any = {};
    if (params.childId && Types.ObjectId.isValid(params.childId)) {
      filter.child = params.childId;
    } else if (params.userId && Types.ObjectId.isValid(params.userId)) {
      filter.user = params.userId;
    } else if (params.parentId && Types.ObjectId.isValid(params.parentId)) {
      filter.parent = params.parentId;
    } else {
      return [];
    }

    return EnrollmentModel.find(filter)
      .select('status paymentStatus enrolleeType billingType createdAt')
      .populate('program', 'title isForChildren programType')
      .populate('phase', 'title orderIndex price')
      .populate('package', 'name price daysPerWeek')
      .populate('child', 'firstname lastname')
      .populate('user', 'firstname lastname email')
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
  }
}
