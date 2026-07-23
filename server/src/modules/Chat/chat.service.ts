import { Types } from 'mongoose';
import { ConversationModel, ConversationMemberModel } from './chat.model';
import { EnrollmentModel } from '../Enrollments/enrollment.model';
import { BatchModel } from '../Batches/batch.model';
import { ScheduleModel } from '../Schedule/schedule.model';
import { ChildModel } from '../Child/child.model';
import { User } from '../User/user.schema';
import { RoleModel } from '../AccessControl/role.model';
import { logger } from '@utils/logger';

export class ChatService {
  /**
   * Generates a unique conversation for a batch if it doesn't already exist
   * Populates it with active students, instructor, and admins.
   */
  public async ensureBatchGroupExists(batchId: string): Promise<any[]> {
    try {
      const batch = await BatchModel.findById(batchId);
      if (!batch) {
         throw new Error(`Batch not found with ID ${batchId}`);
      }

      // Fetch all Discussion slots for this batch
      const discussionSchedules = await ScheduleModel.find({
        batch: new Types.ObjectId(batchId),
        type: 'DISCUSSION'
      });

      if (discussionSchedules.length === 0) {
        logger.warn(`No discussion schedules found for batch ${batchId}. No group chats created.`);
        return [];
      }

      // Fetch Admins
      const adminRoles = await RoleModel.find({ code: { $in: ['admin', 'super_admin', 'superadmin', 'super-admin'] } }).select('_id');
      const adminRoleIds = adminRoles.map((r: any) => r._id);
      const admins = await User.find({ roles: { $in: adminRoleIds }, status: 'active' }).select('_id');
      const instructorId = batch.instructor;

      const createdGroups: any[] = [];
      const ageGroups: ('JUNIOR' | 'SENIOR')[] = ['JUNIOR', 'SENIOR'];

      for (const schedule of discussionSchedules) {
        for (const ageGrp of ageGroups) {
          // Check or create conversation for this specific schedule slot AND age group
          const groupChat = await ConversationModel.findOneAndUpdate(
            { type: 'GROUP', batchId: new Types.ObjectId(batchId), scheduleId: schedule._id, ageGroup: ageGrp },
            {
              $setOnInsert: {
                type: 'GROUP',
                name: `${batch.batchName} - ${schedule.dayOfWeek} (${schedule.startTime}) [${ageGrp}]`,
                programId: batch.program,
                batchId: new Types.ObjectId(batchId),
                scheduleId: schedule._id,
                ageGroup: ageGrp,
                isActive: true,
              }
            },
            { new: true, upsert: true }
          );

          // Fetch active students for this batch and this specific schedule
          const activeEnrollments = await EnrollmentModel.find({
            batch: new Types.ObjectId(batchId),
            selectedSchedules: schedule._id,
            status: 'ACTIVE'
          }).populate('child');

          const operations: any[] = [];

          // Add Admins
          for (const admin of admins) {
            operations.push({
              updateOne: {
                filter: { conversationId: groupChat._id, userId: admin._id },
                update: { $set: { role: 'ADMIN' } },
                upsert: true
              }
            });
          }

          // Add Instructor
          if (instructorId) {
            operations.push({
              updateOne: {
                filter: { conversationId: groupChat._id, userId: instructorId },
                update: { $set: { role: 'INSTRUCTOR' } },
                upsert: true
              }
            });
          }

          // Add specific Students filtered by age
          for (const enrollment of activeEnrollments) {
             const child = enrollment.child as any;
             if (!child) continue;

             const age = child.age; // virtual from ChildModel
             const isJunior = age >= 9 && age <= 12;
             const isSenior = age >= 13 && age <= 18;

             if ((ageGrp === 'JUNIOR' && isJunior) || (ageGrp === 'SENIOR' && isSenior)) {
               operations.push({
                 updateOne: {
                   filter: { conversationId: groupChat._id, childId: child._id },
                   update: { $set: { role: 'STUDENT' } },
                   upsert: true
                 }
               });
             }
          }

          if (operations.length > 0) {
            await ConversationMemberModel.bulkWrite(operations, { ordered: false });
          }
          
          createdGroups.push(groupChat);
        }
      }

      logger.info(`${createdGroups.length} Discussion groups (JUNIOR/SENIOR) synced for batch: ${batchId}`);
      return createdGroups;
    } catch (error) {
      logger.error(`Error ensuring batch group exists for ${batchId}:`, error);
      throw error;
    }
  }

  /**
   * Adds a child student to batch discussion groups (age-bucketed JUNIOR/SENIOR when DOB known).
   */
  public async addStudentToBatchGroup(batchId: string, childId: string): Promise<void> {
     try {
       const enrollment = await EnrollmentModel.findOne({
         batch: new Types.ObjectId(batchId),
         child: new Types.ObjectId(childId),
         status: 'ACTIVE'
       }).populate('child');

       if (!enrollment || !enrollment.child) {
         logger.warn(`No active enrollment found for child ${childId} in batch ${batchId}`);
         return;
       }

       const child = enrollment.child as any;
       const age = child.age;
       let targetAgeGroup: 'JUNIOR' | 'SENIOR' | null =
         (age >= 9 && age <= 12) ? 'JUNIOR' :
         (age >= 13 && age <= 18) ? 'SENIOR' : null;

       // No DOB/age: still add to all discussion groups for selected schedules
       const groupQuery: any = {
         type: 'GROUP',
         batchId: new Types.ObjectId(batchId),
         scheduleId: { $in: enrollment.selectedSchedules },
       };
       if (targetAgeGroup) {
         groupQuery.ageGroup = targetAgeGroup;
       }

       const matchingGroups = await ConversationModel.find(groupQuery);

       if (matchingGroups.length > 0) {
         const operations = matchingGroups.map(group => ({
           updateOne: {
             filter: { conversationId: group._id, childId: new Types.ObjectId(childId) },
             update: { $set: { role: 'STUDENT' } },
             upsert: true
           }
         }));
         await ConversationMemberModel.bulkWrite(operations, { ordered: false });
         logger.info(`Student ${childId} added to ${matchingGroups.length} groups in batch ${batchId}`);
       } else {
         await this.ensureBatchGroupExists(batchId);
       }
     } catch (err) {
         logger.error(`Failed to add student ${childId} to discussion groups for batch ${batchId}:`, err);
     }
  }

  /** Adds an adult (self-enrolled User) to batch discussion groups via userId membership. */
  public async addAdultStudentToBatchGroup(batchId: string, userId: string): Promise<void> {
    try {
      const enrollment = await EnrollmentModel.findOne({
        batch: new Types.ObjectId(batchId),
        user: new Types.ObjectId(userId),
        status: 'ACTIVE',
      });

      if (!enrollment) {
        logger.warn(`No active self-enrollment found for user ${userId} in batch ${batchId}`);
        return;
      }

      const matchingGroups = await ConversationModel.find({
        type: 'GROUP',
        batchId: new Types.ObjectId(batchId),
        scheduleId: { $in: enrollment.selectedSchedules },
      });

      if (matchingGroups.length > 0) {
        const operations = matchingGroups.map(group => ({
          updateOne: {
            filter: { conversationId: group._id, userId: new Types.ObjectId(userId) },
            update: { $set: { role: 'STUDENT' } },
            upsert: true,
          },
        }));
        await ConversationMemberModel.bulkWrite(operations, { ordered: false });
        logger.info(`Adult student ${userId} added to ${matchingGroups.length} groups in batch ${batchId}`);
      } else {
        await this.ensureBatchGroupExists(batchId);
      }
    } catch (err) {
      logger.error(`Failed to add adult student ${userId} to discussion groups for batch ${batchId}:`, err);
    }
  }

  /**
   * Generates a unique conversation for a Program (Announcement Group/Broadcast)
   */
  public async ensureProgramGroupExists(programId: string): Promise<any> {
    try {
      // Lazy load to avoid circular dependency
      const { ProgramModel } = await import('../Programs/program.model');
      const program = await ProgramModel.findById(programId);
      if (!program) throw new Error(`Program not found with ID ${programId}`);

      const programGroup = await ConversationModel.findOneAndUpdate(
        { type: 'PROGRAM_GROUP', programId: new Types.ObjectId(programId) },
        {
          $setOnInsert: {
            type: 'PROGRAM_GROUP',
            name: `${program.title} Announcements`,
            programId: new Types.ObjectId(programId),
            isActive: true,
          }
        },
        { new: true, upsert: true }
      );

      await this.syncProgramGroupMembers(programGroup._id, programId);
      logger.info(`Program announcement group exists and members synced for program: ${programId}`);
      return programGroup;
    } catch (error) {
      logger.error(`Error ensuring program group exists for ${programId}:`, error);
      throw error;
    }
  }

  /**
   * Syncs all relevant members (Admins, Instructors, Students) to a program announcement group
   */
  public async syncProgramGroupMembers(conversationId: Types.ObjectId, programId: string): Promise<void> {
    try {
      // 1. Fetch Admins
      const adminRoles = await RoleModel.find({ code: { $in: ['admin', 'super_admin', 'superadmin', 'super-admin'] } }).select('_id');
      const adminRoleIds = adminRoles.map((r: any) => r._id);
      const admins = await User.find({ roles: { $in: adminRoleIds }, status: 'active' }).select('_id');

      // 2. Fetch all Instructors assigned to any batch in this program
      const batchesInProgram = await BatchModel.find({ program: new Types.ObjectId(programId) }).select('instructor');
      const instructorIds = [...new Set(batchesInProgram.map(b => b.instructor?.toString()).filter(Boolean))] as string[];

      // 3. Fetch all active Students enrolled in any batch in this program
      const activeEnrollments = await EnrollmentModel.find({
        program: new Types.ObjectId(programId),
        status: 'ACTIVE'
      }).select('child user enrolleeType');

      const operations: any[] = [];

      // Upsert Admins
      for (const admin of admins) {
        operations.push({
          updateOne: {
            filter: { conversationId, userId: admin._id },
            update: { $set: { role: 'ADMIN' } },
            upsert: true
          }
        });
      }

      // Upsert Instructors
      for (const instId of instructorIds) {
        operations.push({
          updateOne: {
            filter: { conversationId, userId: new Types.ObjectId(instId) },
            update: { $set: { role: 'INSTRUCTOR' } },
            upsert: true
          }
        });
      }

      // Upsert Students (child or self-enrolled adult)
      for (const enrollment of activeEnrollments) {
        if (enrollment.user) {
          operations.push({
            updateOne: {
              filter: { conversationId, userId: enrollment.user },
              update: { $set: { role: 'STUDENT' } },
              upsert: true
            }
          });
        } else if (enrollment.child) {
          operations.push({
            updateOne: {
              filter: { conversationId, childId: enrollment.child },
              update: { $set: { role: 'STUDENT' } },
              upsert: true
            }
          });
        }
      }

      if (operations.length > 0) {
        await ConversationMemberModel.bulkWrite(operations, { ordered: false });
      }
    } catch (error) {
      logger.error(`Failed to sync members for program group ${programId}:`, error);
    }
  }

  /**
   * Syncs a specific child to all their relevant groups (Program & Batch)
   * Useful for "lazy syncing" when a user logs in.
   */
  public async syncUserGroups(childId: string): Promise<void> {
    try {
      const activeEnrollments = await EnrollmentModel.find({
        child: new Types.ObjectId(childId),
        status: 'ACTIVE'
      });

      if (activeEnrollments.length === 0) return;

      for (const enrollment of activeEnrollments) {
        // 1. Ensure Program Group Membership
        const programGroup = await this.ensureProgramGroupExists(enrollment.program.toString());
        if (programGroup) {
          await ConversationMemberModel.updateOne(
            { conversationId: programGroup._id, childId: new Types.ObjectId(childId) },
            { $set: { role: 'STUDENT' } },
            { upsert: true }
          );
        }

        // 2. Ensure Batch Group Membership
        await this.addStudentToBatchGroup(enrollment.batch.toString(), childId);
      }
      
      logger.info(`Lazy sync completed for child: ${childId}`);
    } catch (error) {
      logger.error(`Failed to lazy sync groups for child ${childId}:`, error);
    }
  }
}
