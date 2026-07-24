import { EnrollmentDao } from "./enrollment.dao";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import { IEnrollment, EnrollmentModel } from "./enrollment.model";
import { ChildModel } from "@modules/Child/child.model";
import { PhaseModel } from "@modules/Phases/phase.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { ScheduleModel } from "@modules/Schedule/schedule.model";
import { PackageModel } from "@modules/Package/package.model";
import { ProgramModel } from "@modules/Programs/program.model";
import { ACADEMIC_SUBJECTS } from "@modules/Package/academicSubjects";
import { User } from "@modules/User/user.schema";
import { RoleModel } from "@modules/AccessControl/role.model";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { logger } from "@utils/logger";
import { Types } from "mongoose";
import { generateSixDigitPin, hashChildPin } from "@modules/Child/child-pin.util";
import { emailService } from "@infra/mail/email.service";

export class EnrollmentService {
  private enrollmentDao = new EnrollmentDao();

  public async prepareEnrollment(userId: string, data: CreateEnrollmentDTO): Promise<IEnrollment[]> {
    const enrolleeType = data.enrolleeType === 'SELF' ? 'SELF' : 'CHILD';

    if (enrolleeType === 'SELF') {
      return this.prepareSelfEnrollment(userId, data);
    }
    return this.prepareChildEnrollment(userId, data);
  }

  /** Adult applies for themselves — no parent profile / child record required. */
  private async prepareSelfEnrollment(userId: string, data: CreateEnrollmentDTO): Promise<IEnrollment[]> {
    logger.info(`EnrollmentService: Preparing SELF enrollment for user ${userId}`);

    const user = await User.findById(userId);
    if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");

    const phone = data.phone?.trim() || user.phone?.trim();
    if (!phone) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Phone number is required for self enrollment");
    }

    // Persist only when provided or profile had none yet
    if (user.phone !== phone) {
      user.phone = phone;
      await user.save();
    }

    const { amount } = await this.validateProgramBatchSchedules(data);

    await this.assertNotAlreadyApplied({
      userId,
      phaseId: data.phaseId,
    });

    await this.ensureStudentRole(user);

    const enrollment = await this.enrollmentDao.create({
      enrolleeType: 'SELF',
      user: new Types.ObjectId(userId) as any,
      parent: new Types.ObjectId(userId) as any,
      program: new Types.ObjectId(data.programId) as any,
      phase: new Types.ObjectId(data.phaseId!) as any,
      batch: new Types.ObjectId(data.batchId!) as any,
      selectedSchedules: (data.selectedSchedules || []).map(id => new Types.ObjectId(id)),
      billingType: 'ONE_TIME',
      status: 'PENDING',
      paymentStatus: 'UNPAID',
      amount,
      isExistingChild: false,
    });

    logger.info(`EnrollmentService: SELF enrollment prepared ${enrollment._id}`);
    return [enrollment];
  }

  /** Parent enrolls one or more children (existing or new). DOB/age optional. */
  private async prepareChildEnrollment(parentId: string, data: CreateEnrollmentDTO): Promise<IEnrollment[]> {
    logger.info(`EnrollmentService: Preparing CHILD enrollment for parent ${parentId}`);

    try {
      const parent = await User.findById(parentId).lean();
      if (!parent) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Parent not found");
      if (!parent.isProfileComplete) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Please complete your parent profile before enrolling a child");
      }

      const program = await ProgramModel.findById(data.programId).lean();
      if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");

      const isTutorial = program.programType === 'ACADEMIC_TUTORIAL' || !!data.packageId;
      const pricing = isTutorial
        ? await this.validateTutorialEnrollment(data, program)
        : await this.validateProgramBatchSchedules(data);

      let childrenToEnroll: any[] = [];

      if (data.childIds && data.childIds.length > 0) {
        const children = await ChildModel.find({ _id: { $in: data.childIds }, parent: parentId });
        if (children.length !== data.childIds.length) {
          throw new HttpException(HttpStatusCodes.NOT_FOUND, "One or more children not found or do not belong to you");
        }
        childrenToEnroll = children;
        logger.info(`EnrollmentService: Enrolling ${children.length} existing children`);
      } else {
        if (!data.firstName || !data.lastName) {
          throw new HttpException(HttpStatusCodes.BAD_REQUEST, "First name and last name are required for new child enrollment");
        }

        const dobDate = data.dob ? new Date(data.dob) : undefined;
        if (dobDate) {
          const currentYear = new Date().getFullYear();
          const age = currentYear - dobDate.getFullYear();
          logger.info(`Enrolling new child aged ${age}`);
        }

        const generatedUsername = `${data.firstName.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`;
        const randomPin = generateSixDigitPin();
        const hashedPin = await hashChildPin(randomPin);

        const childPayload: any = {
          firstname: data.firstName,
          lastname: data.lastName,
          username: generatedUsername,
          pin: hashedPin,
          plainPin: randomPin,
          parent: new Types.ObjectId(parentId),
          gender: 'male',
          grade: data.grade,
          isUSA: data.isUSA || false,
          country: data.country,
          region: data.region,
          status: 'active',
        };
        if (dobDate) childPayload.birthdate = dobDate;

        const newChild = await ChildModel.create(childPayload);
        childrenToEnroll = [newChild];
        logger.info(`EnrollmentService: Created new child ${newChild._id}`);

        if (parent.email) {
          emailService
            .sendChildRegistrationEmail(parent.email, data.firstName, generatedUsername, randomPin)
            .catch((err) => {
              logger.error(
                `[EnrollmentService] Failed to send registration email to ${parent.email}: ${err}`
              );
            });
        }
      }

      const enrollments: IEnrollment[] = [];
      const isExistingChild = !!(data.childIds && data.childIds.length > 0);

      for (const child of childrenToEnroll) {
        if (isTutorial) {
          await this.assertNotAlreadyApplied({
            childId: child._id.toString(),
            packageId: data.packageId!,
          });

          const enrollment = await this.enrollmentDao.create({
            enrolleeType: 'CHILD',
            child: child._id as any,
            parent: new Types.ObjectId(parentId) as any,
            program: new Types.ObjectId(data.programId) as any,
            package: new Types.ObjectId(data.packageId!) as any,
            subjects: data.subjects || [],
            timeBlocks: data.timeBlocks || [],
            notes: data.notes,
            billingType: 'MONTHLY',
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            amount: pricing.amount,
            isExistingChild,
          });
          enrollments.push(enrollment);
        } else {
          await this.assertNotAlreadyApplied({
            childId: child._id.toString(),
            phaseId: data.phaseId!,
          });

          const enrollment = await this.enrollmentDao.create({
            enrolleeType: 'CHILD',
            child: child._id as any,
            parent: new Types.ObjectId(parentId) as any,
            program: new Types.ObjectId(data.programId) as any,
            phase: new Types.ObjectId(data.phaseId!) as any,
            batch: new Types.ObjectId(data.batchId!) as any,
            selectedSchedules: (data.selectedSchedules || []).map(id => new Types.ObjectId(id)),
            billingType: 'ONE_TIME',
            status: 'PENDING',
            paymentStatus: 'UNPAID',
            amount: pricing.amount,
            isExistingChild,
          });
          enrollments.push(enrollment);
        }
      }

      logger.info(`EnrollmentService: ${enrollments.length} CHILD enrollments prepared successfully.`);
      return enrollments;
    } catch (error) {
      logger.error(`EnrollmentService Error: ${error}`);
      throw error;
    }
  }

  private async validateTutorialEnrollment(data: CreateEnrollmentDTO, program: any) {
    if (program.programType !== 'ACADEMIC_TUTORIAL') {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'This program does not support tutoring packages');
    }
    if (!data.packageId) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Please select a tutoring package');
    }

    const pkg = await PackageModel.findById(data.packageId).lean();
    if (!pkg) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Selected package not found');
    if (!pkg.isActive) throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'This package is currently unavailable');
    if (pkg.program.toString() !== data.programId) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Package does not belong to this program');
    }

    const subjects = data.subjects || [];
    if (subjects.length === 0) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Select at least one subject');
    }
    const subjectNames = new Set<string>();
    for (const s of subjects) {
      if (!(ACADEMIC_SUBJECTS as readonly string[]).includes(s.name)) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Invalid subject: ${s.name}`);
      }
      if (subjectNames.has(s.name)) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Duplicate subject: ${s.name}`);
      }
      subjectNames.add(s.name);
    }

    const timeBlocks = data.timeBlocks || [];
    if (timeBlocks.length !== pkg.daysPerWeek) {
      throw new HttpException(
        HttpStatusCodes.BAD_REQUEST,
        `This package requires exactly ${pkg.daysPerWeek} time block(s)`
      );
    }

    for (const block of timeBlocks) {
      if (!subjectNames.has(block.subject)) {
        throw new HttpException(
          HttpStatusCodes.BAD_REQUEST,
          `Time block subject "${block.subject}" must be one of the selected subjects`
        );
      }
      if (block.startTime >= block.endTime) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Each time block end time must be after start time');
      }
    }

    // No overlapping blocks on the same day
    for (let i = 0; i < timeBlocks.length; i++) {
      for (let j = i + 1; j < timeBlocks.length; j++) {
        const a = timeBlocks[i];
        const b = timeBlocks[j];
        if (a.dayOfWeek === b.dayOfWeek) {
          if (
            (a.startTime >= b.startTime && a.startTime < b.endTime) ||
            (b.startTime >= a.startTime && b.startTime < a.endTime)
          ) {
            throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Time conflict on ${a.dayOfWeek}`);
          }
        }
      }
    }

    return { amount: pkg.price, package: pkg };
  }

  /**
   * Block duplicate applications for the same learner + phase/package
   */
  private async assertNotAlreadyApplied(opts: {
    userId?: string;
    childId?: string;
    phaseId?: string;
    packageId?: string;
  }): Promise<void> {
    const filter: any = {
      status: { $in: ['PENDING', 'ACTIVE', 'COMPLETED'] },
    };

    if (opts.phaseId) filter.phase = new Types.ObjectId(opts.phaseId);
    if (opts.packageId) filter.package = new Types.ObjectId(opts.packageId);

    if (opts.userId) {
      filter.user = new Types.ObjectId(opts.userId);
    } else if (opts.childId) {
      filter.child = new Types.ObjectId(opts.childId);
    } else {
      return;
    }

    const existing = await EnrollmentModel.findOne(filter).lean();
    if (existing) {
      throw new HttpException(
        HttpStatusCodes.CONFLICT,
        opts.packageId
          ? 'You already applied for that tutoring package'
          : 'You already applied for that phase'
      );
    }
  }

  public async getMyPendingEnrollments(userId: string): Promise<IEnrollment[]> {
    return EnrollmentModel.find({
      parent: userId,
      status: 'PENDING',
    })
      .populate('child')
      .populate('user', 'firstname lastname email')
      .populate('program')
      .populate('phase')
      .populate('package')
      .populate('batch')
      .sort({ createdAt: -1 });
  }

  /**
   * Current user's enrollments for a program (self as learner, or as payer/parent).
   * Used by program detail to show Enrolled / Pay Pending / Enroll.
   */
  public async getMyEnrollmentsForProgram(userId: string, programId: string): Promise<IEnrollment[]> {
    if (!Types.ObjectId.isValid(programId)) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, 'Invalid program id');
    }

    return EnrollmentModel.find({
      program: new Types.ObjectId(programId),
      status: { $in: ['PENDING', 'ACTIVE', 'COMPLETED'] },
      $or: [
        { user: new Types.ObjectId(userId) },
        { parent: new Types.ObjectId(userId) },
      ],
    })
      .populate('child', 'firstname lastname')
      .populate('user', 'firstname lastname email')
      .populate('phase', 'title price orderIndex')
      .populate('package', 'name price daysPerWeek')
      .populate('batch', 'batchName')
      .sort({ createdAt: -1 })
      .lean() as any;
  }

  public async updateEnrollmentSchedule(parentId: string, enrollmentId: string, selectedScheduleIds: string[]): Promise<IEnrollment> {
    logger.info(`EnrollmentService: Updating schedule for enrollment ${enrollmentId} (parent: ${parentId})`);

    const enrollment = await EnrollmentModel.findOne({
      _id: enrollmentId,
      parent: new Types.ObjectId(parentId),
    });

    if (!enrollment) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "Enrollment not found or access denied");
    }

    if (!enrollment.batch) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "This enrollment does not use batch schedules");
    }

    await this.validateSelectedSchedules(enrollment.batch.toString(), selectedScheduleIds, enrollmentId);

    enrollment.selectedSchedules = selectedScheduleIds.map(id => new Types.ObjectId(id));
    await enrollment.save();

    return enrollment.populate('selectedSchedules');
  }

  private async validateProgramBatchSchedules(data: CreateEnrollmentDTO) {
    const phase = await PhaseModel.findById(data.phaseId).lean();
    if (!phase) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Selected phase not found");
    if (!phase.isActive) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "This phase is currently closed for enrollment");

    const batch = await BatchModel.findById(data.batchId).lean();
    if (!batch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Selected batch not found");
    if (batch.program.toString() !== data.programId) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Selected batch does not belong to the selected program");
    }

    if (batch.capacity) {
      const activeEnrollmentsCount = await EnrollmentModel.countDocuments({
        batch: data.batchId,
        status: { $ne: 'CANCELLED' },
      });
      if (activeEnrollmentsCount >= batch.capacity) {
        await BatchModel.findByIdAndUpdate(data.batchId, { isActive: false });
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Selected batch is full. Please choose another one.");
      }
      if (activeEnrollmentsCount + 1 >= batch.capacity) {
        await BatchModel.findByIdAndUpdate(data.batchId, { isActive: false });
        logger.info(`Batch ${data.batchId} is now full and has been deactivated.`);
      }
    }

    await this.validateSelectedSchedules(data.batchId!, data.selectedSchedules);
    return { amount: phase.price || 0, phase, batch };
  }

  private async ensureStudentRole(user: any): Promise<void> {
    const studentRole = await RoleModel.findOne({ code: 'student' });
    if (!studentRole) return;

    const roleIds = (user.roles || []).map((r: any) => r.toString());
    if (!roleIds.includes(studentRole._id.toString())) {
      user.roles = [...(user.roles || []), studentRole._id];
      await user.save();
      logger.info(`Assigned student role to user ${user._id}`);
    }
  }

  private async validateSelectedSchedules(batchId: string, selectedScheduleIds: string[] = [], excludeEnrollmentId?: string): Promise<void> {
    const availableSchedules = await ScheduleModel.find({ batch: batchId }).lean();

    const groupedAvailable = availableSchedules.reduce((acc: any, s) => {
      if (!acc[s.sessionLabel]) acc[s.sessionLabel] = [];
      acc[s.sessionLabel].push(s);
      return acc;
    }, {});

    const requiredLabels = Object.keys(groupedAvailable);

    if (requiredLabels.length > 0) {
      const selectedSlots = await ScheduleModel.find({ _id: { $in: selectedScheduleIds } }).lean();

      const wrongBatch = selectedSlots.find((s) => s.batch.toString() !== batchId);
      if (wrongBatch) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Selected schedules must belong to the chosen batch for this program");
      }

      if (selectedSlots.length !== requiredLabels.length) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Please select exactly one slot from each session group: ${requiredLabels.join(', ')}`);
      }

      const selectedLabels = new Set(selectedSlots.map(s => s.sessionLabel));
      if (selectedLabels.size !== requiredLabels.length) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Each selected slot must belong to a different session group");
      }

      for (let i = 0; i < selectedSlots.length; i++) {
        for (let j = i + 1; j < selectedSlots.length; j++) {
          const s1 = selectedSlots[i];
          const s2 = selectedSlots[j];

          if (s1.dayOfWeek === s2.dayOfWeek) {
            if (
              (s1.startTime >= s2.startTime && s1.startTime < s2.endTime) ||
              (s2.startTime >= s1.startTime && s2.startTime < s1.endTime)
            ) {
              throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Time conflict detected between "${s1.sessionLabel}" and "${s2.sessionLabel}" on ${s1.dayOfWeek}`);
            }
          }
        }
      }

      for (const slot of selectedSlots) {
        const query: any = {
          selectedSchedules: slot._id,
          status: { $ne: 'CANCELLED' },
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
