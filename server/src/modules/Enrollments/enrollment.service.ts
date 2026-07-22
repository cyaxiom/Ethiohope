import { EnrollmentDao } from "./enrollment.dao";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import { IEnrollment, EnrollmentModel } from "./enrollment.model";
import { ChildModel } from "@modules/Child/child.model";
import { PhaseModel } from "@modules/Phases/phase.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { ScheduleModel } from "@modules/Schedule/schedule.model";
import { User } from "@modules/User/user.schema";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { logger } from "@utils/logger";
import { Types } from "mongoose";
import bcrypt from 'bcryptjs';

export class EnrollmentService {
  private enrollmentDao = new EnrollmentDao();

  public async prepareEnrollment(parentId: string, data: CreateEnrollmentDTO): Promise<IEnrollment[]> {
    logger.info(`EnrollmentService: Preparing enrollment for parent ${parentId}`);

    try {
      // 1. Validate Parent Profile
      const parent = await User.findById(parentId).lean();
      if (!parent) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Parent not found");
      if (!parent.isProfileComplete) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Please complete your parent profile before enrolling a child");
      }

      // 2. Validate Phase
      const phase = await PhaseModel.findById(data.phaseId).lean();
      if (!phase) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Selected phase not found");
      if (!phase.isActive) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "This phase is currently closed for enrollment");

      // 3. Validate Batch
      const batch = await BatchModel.findById(data.batchId).lean();
      if (!batch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Selected batch not found");
      if (batch.program.toString() !== data.programId) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Selected batch does not belong to the selected program");
      }

      // Check capacity if applicable
      if (batch.capacity) {
        const activeEnrollmentsCount = await EnrollmentModel.countDocuments({ batch: data.batchId, status: { $ne: 'CANCELLED' } });
        if (activeEnrollmentsCount >= batch.capacity) {
          // Auto-deactivate batch if it's full
          await BatchModel.findByIdAndUpdate(data.batchId, { isActive: false });
          throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Selected batch is full. Please choose another one.");
        }
        
        // If this enrollment will fill the batch, deactivate it
        if (activeEnrollmentsCount + 1 >= batch.capacity) {
          await BatchModel.findByIdAndUpdate(data.batchId, { isActive: false });
          logger.info(`Batch ${data.batchId} is now full and has been deactivated.`);
        }
      }

      // 4. Validate Selected Schedules
      await this.validateSelectedSchedules(data.batchId, data.selectedSchedules);

      // 5. Handle Child Selection/Creation
      let childrenToEnroll: any[] = [];
      
      if (data.childIds && data.childIds.length > 0) {
        // Use existing children
        const children = await ChildModel.find({ _id: { $in: data.childIds }, parent: parentId });
        if (children.length !== data.childIds.length) {
          throw new HttpException(HttpStatusCodes.NOT_FOUND, "One or more children not found or do not belong to you");
        }
        childrenToEnroll = children;
        logger.info(`EnrollmentService: Enrolling ${children.length} existing children`);
      } else {
        // Create new child (Original flow)
        if (!data.firstName || !data.lastName || !data.dob || !data.grade) {
          throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Missing required child information for new enrollment");
        }

        const dobDate = new Date(data.dob);
        const currentYear = new Date().getFullYear();
        const age = currentYear - dobDate.getFullYear();
        logger.info(`Enrolling new child aged ${age}`);

        const generatedUsername = `${data.firstName.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`;
        const randomPin = Math.floor(1000 + Math.random() * 9000).toString();
        const hashedPin = await bcrypt.hash(randomPin, 10);

        const newChild = await ChildModel.create({
          firstname: data.firstName,
          lastname: data.lastName,
          username: generatedUsername,
          pin: hashedPin,
          plainPin: randomPin,
          parent: new Types.ObjectId(parentId),
          gender: 'male', 
          birthdate: dobDate,
          grade: data.grade,
          isUSA: data.isUSA || false,
          country: data.country,
          region: data.region,
          status: 'active'
        });
        childrenToEnroll = [newChild];
        logger.info(`EnrollmentService: Created new child ${newChild._id}`);
      }

      // 7. Create Enrollments (PENDING)
      const enrollments: IEnrollment[] = [];
      const isExistingChild = !!(data.childIds && data.childIds.length > 0);
      
      for (const child of childrenToEnroll) {
        // 6. Cancel any existing duplicate pending enrollments for this specific child and phase
        await EnrollmentModel.updateMany(
          {
            child: child._id,
            phase: data.phaseId,
            status: 'PENDING'
          },
          { status: 'CANCELLED' }
        );

        const enrollment = await this.enrollmentDao.create({
          child: child._id as any,
          parent: new Types.ObjectId(parentId) as any,
          program: new Types.ObjectId(data.programId) as any,
          phase: new Types.ObjectId(data.phaseId) as any,
          batch: new Types.ObjectId(data.batchId) as any,
          selectedSchedules: (data.selectedSchedules || []).map(id => new Types.ObjectId(id)),
          status: 'PENDING',
          paymentStatus: 'UNPAID',
          amount: phase.price || 0,
          isExistingChild: isExistingChild
        });
        enrollments.push(enrollment);
      }

      logger.info(`EnrollmentService: ${enrollments.length} enrollments prepared successfully.`);
      return enrollments;
    } catch (error) {
      logger.error(`EnrollmentService Error: ${error}`);
      throw error;
    }
  }

  public async getMyPendingEnrollments(parentId: string): Promise<IEnrollment[]> {
    return EnrollmentModel.find({
      parent: parentId,
      status: 'PENDING',
    })
      .populate('child')
      .populate('program')
      .populate('phase')
      .populate('batch')
      .sort({ createdAt: -1 });
  }

  /**
   * Update enrollment schedules for a parent's child
   */
  public async updateEnrollmentSchedule(parentId: string, enrollmentId: string, selectedScheduleIds: string[]): Promise<IEnrollment> {
    logger.info(`EnrollmentService: Updating schedule for enrollment ${enrollmentId} (parent: ${parentId})`);

    const enrollment = await EnrollmentModel.findOne({ 
      _id: enrollmentId, 
      parent: new Types.ObjectId(parentId) 
    });
    
    if (!enrollment) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Enrollment not found or access denied");
    }

    // Validate new schedules against the same batch
    await this.validateSelectedSchedules(enrollment.batch.toString(), selectedScheduleIds, enrollmentId);

    // Update enrollment
    enrollment.selectedSchedules = selectedScheduleIds.map(id => new Types.ObjectId(id));
    await enrollment.save();

    return enrollment.populate('selectedSchedules');
  }

  /**
   * Shared logic to validate selected schedules
   */
  private async validateSelectedSchedules(batchId: string, selectedScheduleIds: string[] = [], excludeEnrollmentId?: string): Promise<void> {
    const availableSchedules = await ScheduleModel.find({ batch: batchId }).lean();
    
    // Group available schedules by sessionLabel
    const groupedAvailable = availableSchedules.reduce((acc: any, s) => {
      if (!acc[s.sessionLabel]) acc[s.sessionLabel] = [];
      acc[s.sessionLabel].push(s);
      return acc;
    }, {});

    const requiredLabels = Object.keys(groupedAvailable);
    
    if (requiredLabels.length > 0) {
      // Ensure one slot is picked from each required label
      const selectedSlots = await ScheduleModel.find({ _id: { $in: selectedScheduleIds } }).lean();
      
      if (selectedSlots.length !== requiredLabels.length) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Please select exactly one slot from each session group: ${requiredLabels.join(', ')}`);
      }

      const selectedLabels = new Set(selectedSlots.map(s => s.sessionLabel));
      if (selectedLabels.size !== requiredLabels.length) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Each selected slot must belong to a different session group");
      }

      // Check for time conflicts among selected slots
      for (let i = 0; i < selectedSlots.length; i++) {
        for (let j = i + 1; j < selectedSlots.length; j++) {
          const s1 = selectedSlots[i];
          const s2 = selectedSlots[j];

          if (s1.dayOfWeek === s2.dayOfWeek) {
            // Check for overlap
            if (
              (s1.startTime >= s2.startTime && s1.startTime < s2.endTime) ||
              (s2.startTime >= s1.startTime && s2.startTime < s1.endTime)
            ) {
              throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Time conflict detected between "${s1.sessionLabel}" and "${s2.sessionLabel}" on ${s1.dayOfWeek}`);
            }
          }
        }
      }

      // Check capacity for each selected slot
      for (const slot of selectedSlots) {
        const query: any = { 
          selectedSchedules: slot._id, 
          status: { $ne: 'CANCELLED' } 
        };
        if (excludeEnrollmentId) {
          query._id = { $ne: excludeEnrollmentId };
        }

        const activeEnrollmentsCount = await EnrollmentModel.countDocuments(query);
        if (slot.capacity && activeEnrollmentsCount >= slot.capacity) {
          throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Session slot "${slot.sessionLabel}" at ${slot.startTime} on ${slot.dayOfWeek} is full.`);
        }
      }
    }
  }
}
