import { User } from "@modules/User/user.schema";
import { RoleModel } from "@accessControll/role.model";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { ChildModel } from "@modules/Child/child.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { PhaseModel } from "@modules/Phases/phase.model";
import { ProgramModel } from "@modules/Programs/program.model";
import { CourseModel } from "@modules/Courses/course.model";
import { ScheduleModel } from "@modules/Schedule/schedule.model";
import { ConversationModel, ConversationMemberModel } from "@modules/Chat/chat.model";
import { MessageModel } from "@modules/Chat/message.model";
import { ProgressModel } from "@modules/Progress/progress.model";
import { SessionModel } from "@modules/Session/session.model";
import { logger } from "@utils/logger";

export class MaintenanceService {
  /**
   * Reset database to its default state
   * Deletes all data except system roles, permissions, and super admins.
   */
  public async resetDatabase() {
    logger.info("MaintenanceService: Starting full database reset request...");

    try {
        // 1. Fetch super admin role to identify protected users
        const superAdminRole = await RoleModel.findOne({ code: 'super_admin' });
        
        // Find all super admins
        const superAdmins = superAdminRole 
            ? await User.find({ roles: superAdminRole._id }).select('_id').lean() 
            : [];
        
        const protectedUserIds = superAdmins.map(u => u._id);

        logger.info(`MaintenanceService: Protecting ${protectedUserIds.length} super admin accounts.`);

        // 2. Clear all transactional and program-related data
        // We use deleteMany({}) for full collection wipe
        await Promise.all([
            EnrollmentModel.deleteMany({}),
            ChildModel.deleteMany({}),
            BatchModel.deleteMany({}),
            PhaseModel.deleteMany({}),
            ProgramModel.deleteMany({}),
            CourseModel.deleteMany({}),
            ScheduleModel.deleteMany({}),
            ConversationModel.deleteMany({}),
            ConversationMemberModel.deleteMany({}),
            MessageModel.deleteMany({}),
            ProgressModel.deleteMany({}),
            SessionModel.deleteMany({}),
        ]);

        // 3. Clear all users EXCEPT super admins
        const deleteResult = await User.deleteMany({ _id: { $nin: protectedUserIds } });

        logger.info(`MaintenanceService: Database reset successful. Deleted ${deleteResult.deletedCount} users.`);
        
        return { 
            success: true, 
            message: "Database reset successfully",
            deletedUsers: deleteResult.deletedCount 
        };
    } catch (err) {
        logger.error("MaintenanceService: CRITICAL - Database reset failed:", err);
        throw err;
    }
  }
}
