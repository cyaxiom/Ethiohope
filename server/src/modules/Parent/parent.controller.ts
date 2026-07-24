import { Request, Response } from "express";
import { asyncHandler } from "@common/utils/asyncHandler";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { RequestWithTokenPayload } from "@auth/auth.interface";
import { UserService } from "@modules/User/user.service";
import { RoleModel } from "@accessControll/role.model";
import { CompleteProfileDTO } from "@modules/User/user.dto";
import { logger } from "@utils/logger";
import { ChildModel } from "@modules/Child/child.model";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { ProgressModel } from "@modules/Progress/progress.model";
import { ProgramModel } from "@modules/Programs/program.model";
import { PhaseModel } from "@modules/Phases/phase.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { ScheduleModel } from "@modules/Schedule/schedule.model";
import { Types } from "mongoose";
import { emailService } from "@infra/mail/email.service";
import { generateTokens } from "@common/Token/token.util";
import { PermissionModel } from "@modules/AccessControl/permission.model";
import { generateSixDigitPin, hashChildPin } from "@modules/Child/child-pin.util";

export class ParentController {
  private userService = new UserService();

  /**
   * Endpoint to complete parent profile
   * POST /parent/complete-profile
   */
  public completeProfile = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    logger.info(`Processing profile completion for user ID: ${tokenPayload?._id}`);
    const data: CompleteProfileDTO = req.body;
    const completedUser = await this.userService.completeProfile(tokenPayload!._id.toString(), data);

    // Fetch role codes for the frontend
    const roles = await RoleModel.find({ _id: { $in: completedUser.roles } });
    const roleCodes = roles.map(r => r.code);

    // Generate a NEW token with the updated roles so the user doesn't get 403
    const { accessToken } = await generateTokens({
      _id: new Types.ObjectId(completedUser._id),
      role: completedUser.roles.map(r => new Types.ObjectId(r)),
      type: 'adult'
    } as any);

    // Fetch permissions for the frontend
    const permissionKeys = roles.length > 0
      ? (await PermissionModel.find({ _id: { $in: roles.flatMap(r => r.permissions) } })).map(p => p.key)
      : [];

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Parent profile completed successfully",
      data: {
        user: completedUser,
        token: accessToken,
        roleCodes,
        permissions: permissionKeys,
      },
    });
  });

  /**
   * Endpoint to initialize child registration flow
   * GET /parent/register-child/init
   */
  public initRegistration = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    logger.info(`Checking profile status for user ID: ${tokenPayload?._id}`);
    
    const { User } = await import("../User/user.schema");
    const user = await User.findById(tokenPayload?._id);
    
    if (!user || user.isProfileComplete !== true) {
      return res.status(HttpStatusCodes.OK).json({ profileCompleted: false });
    }

    // Since programs and phases are now fetched via fronted dynamic queries, 
    // we only need to affirm that the profile is complete so the UI can proceed.
    res.status(HttpStatusCodes.OK).json({ profileCompleted: true });
  });

  /**
   * Endpoint to get parent's children with their enrollments and progress
   * GET /parent/children
   */
  public getChildren = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;
    const { search, progressCategory } = req.query;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    // Build search query for children
    const childQuery: any = { parent: parentId };
    if (search) {
      childQuery.$or = [
        { firstname: { $regex: search, $options: 'i' } },
        { lastname: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
      ];
    }

    // Find all children for this parent (latest to oldest)
    const children = await ChildModel.find(childQuery).sort({ createdAt: -1 }).lean();
    
    // For each child, find their enrollments with program, phase details and progress
    const childrenWithDetails = await Promise.all(children.map(async (child) => {
      const enrollments = await EnrollmentModel.find({ child: child._id })
        .populate('program', 'title description image')
        .populate('phase', 'title orderIndex isActive')
        .populate('batch', 'batchName')
        .populate('selectedSchedules')
        .sort({ createdAt: -1 })
        .lean();
      
      const enrollmentsWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
        const progress = await ProgressModel.findOne({ enrollment: enrollment._id }).lean();
        return {
          ...enrollment,
          progress: progress?.percentage || 0,
        };
      }));

      // Calculate stats
      const totalEnrollments = enrollmentsWithProgress.length;
      const avgProgress = totalEnrollments > 0 
        ? Math.round(enrollmentsWithProgress.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrollments) 
        : 0;
      
      return {
        ...child,
        enrollments: enrollmentsWithProgress,
        stats: {
          totalCourses: totalEnrollments,
          avgProgress: avgProgress,
        }
      };
    }));

    // Filter by progress category if provided
    let filteredChildren = childrenWithDetails;
    if (progressCategory) {
      filteredChildren = childrenWithDetails.filter(child => {
        if (!child.enrollments || child.enrollments.length === 0) {
          return progressCategory === '0'; // If no enrollments, assume 0% progress
        }
        
        return child.enrollments.some(enrollment => {
          const p = (enrollment as any).progress;
          if (progressCategory === '0') return p === 0;
          if (progressCategory === 'lessThan50') return p > 0 && p < 50;
          if (progressCategory === 'above50') return p >= 50;
          return true;
        });
      });
    }

    res.status(HttpStatusCodes.OK).json({ success: true, data: filteredChildren });
  });

  /**
   * Endpoint to get specific child details
   * GET /parent/children/:id
   */
  public getChildDetails = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;
    const childId = req.params.id;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    // Find child and verify ownership
    const child = await ChildModel.findOne({ _id: childId, parent: parentId }).lean();
    if (!child) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: "Child not found or access denied" });
    }

    // Get all enrollments with detailed info
    const enrollments = await EnrollmentModel.find({ child: childId })
      .populate('program')
      .populate('phase')
      .populate({
        path: 'batch',
        populate: {
          path: 'schedules'
        }
      })
      .populate('selectedSchedules')
      .sort({ createdAt: -1 })
      .lean();

    const enrollmentsWithProgress = await Promise.all(enrollments.map(async (enrollment) => {
      const progress = await ProgressModel.findOne({ enrollment: enrollment._id }).lean();
      return {
        ...enrollment,
        progress: progress?.percentage || 0,
        progressDetails: progress,
      };
    }));

    // Calculate stats
    const totalEnrollments = enrollmentsWithProgress.length;
    const avgProgress = totalEnrollments > 0 
      ? Math.round(enrollmentsWithProgress.reduce((acc, curr) => acc + curr.progress, 0) / totalEnrollments) 
      : 0;
    
    // Count completed as achievements
    const completedCourses = enrollmentsWithProgress.filter(e => e.status === 'COMPLETED' || e.progress === 100).length;

    res.status(HttpStatusCodes.OK).json({ 
      success: true, 
      data: {
        ...child,
        enrollments: enrollmentsWithProgress,
        stats: {
          totalCourses: totalEnrollments,
          avgProgress: avgProgress,
          achievements: completedCourses,
        }
      }
    });
  });

  /**
   * Endpoint to register a child without program enrollment
   * POST /parent/children/register
   */
  public registerChild = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;
    const data = req.body;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    // Age Validation
    const birthdate = new Date(data.birthdate);
    const today = new Date();
    let age = today.getFullYear() - birthdate.getFullYear();
    const monthDiff = today.getMonth() - birthdate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
      age--;
    }

    if (age < 9 || age > 18) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ 
        success: false, 
        message: `Invalid age: ${age}. Only children between 9 and 18 years old can be registered.` 
      });
    }

    const { User } = await import("../User/user.schema");
    const parent = await User.findById(parentId);

    if (!parent) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: "Parent not found" });
    }

    const generatedUsername = `${data.firstname.toLowerCase()}${Math.floor(100 + Math.random() * 900)}`;
    const randomPin = generateSixDigitPin();
    const hashedPin = await hashChildPin(randomPin);

    const child = await ChildModel.create({
      firstname: data.firstname,
      lastname: data.lastname,
      username: generatedUsername,
      pin: hashedPin,
      plainPin: randomPin,
      parent: new Types.ObjectId(parentId),
      gender: data.gender || 'male',
      birthdate: birthdate,
      grade: data.grade,
      isUSA: data.isUSA || false,
      country: data.country || '',
      region: data.region || '',
      status: 'active'
    });

    try {
      await emailService.sendChildRegistrationEmail(parent.email, data.firstname, generatedUsername, randomPin);
    } catch (emailError) {
      logger.error(`Failed to send credentials email for child ${child._id}: ${emailError}`);
      // Don't fail the request if email fails, child is still created
    }

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: `Congratulations! ${data.firstname} is registered. Login credentials were sent to your email. Please proceed to payment to unlock courses — they can already log in with locked courses until then.`,
      data: child
    });
  });

  /**
   * Regenerate a child's 6-digit PIN
   * POST /parent/children/:id/regenerate-pin
   */
  public regenerateChildPin = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;
    const childId = req.params.id;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    const child = await ChildModel.findOne({ _id: childId, parent: parentId });
    if (!child) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: "Child not found" });
    }

    const newPin = generateSixDigitPin();
    child.pin = await hashChildPin(newPin);
    child.plainPin = newPin;
    await child.save();

    const { User } = await import("../User/user.schema");
    const parent = await User.findById(parentId).select('email');
    if (parent?.email) {
      emailService
        .sendChildPinResetEmail(parent.email, child.firstname || 'Student', child.username, newPin)
        .catch((err) => {
          logger.error(`Failed to send PIN reset email for child ${child._id}: ${err}`);
        });
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "New PIN generated successfully",
      data: {
        _id: child._id,
        username: child.username,
        plainPin: newPin,
      },
    });
  });

  /**
   * Endpoint to get parent dashboard stats
   * GET /parent/dashboard/stats
   */
  public getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    // 1. Fetch children
    const children = await ChildModel.find({ parent: parentId }).lean();
    
    // 2. Map children to progress data
    const childrenProgress = await Promise.all(children.map(async (child) => {
      const enrollments = await EnrollmentModel.find({ child: child._id });
      
      let totalProgress = 0;
      if (enrollments.length > 0) {
        const progressRecords = await Promise.all(enrollments.map(e => 
          ProgressModel.findOne({ enrollment: e._id }).lean()
        ));
        totalProgress = progressRecords.reduce((acc, curr) => acc + (curr?.percentage || 0), 0) / enrollments.length;
      }

      return {
        name: `${child.firstname} ${child.lastname}`,
        grade: child.grade || 'Not assigned',
        progress: Math.round(totalProgress),
        attendance: 100, // Mocked for now
        lastResult: 'A'  // Mocked for now
      };
    }));

    // 3. Sort by progress (Highest to Lowest)
    childrenProgress.sort((a, b) => b.progress - a.progress);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: {
        totalChildren: children.length,
        unreadMessages: 5, // Mocked
        notifications: 12, // Mocked
        childrenProgress
      }
    });
  });

  /**
   * Endpoint to update enrollment schedules
   * PATCH /parent/enrollments/:enrollmentId/schedule
   */
  public updateEnrollmentSchedule = asyncHandler(async (req: Request, res: Response) => {
    const { tokenPayload } = req as RequestWithTokenPayload;
    const parentId = tokenPayload?._id;
    const { enrollmentId } = req.params;
    const { selectedSchedules } = req.body;

    if (!parentId) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }

    if (!selectedSchedules || !Array.isArray(selectedSchedules)) {
      return res.status(HttpStatusCodes.BAD_REQUEST).json({ success: false, message: "Selected schedules are required" });
    }

    // Reuse validation logic from EnrollmentService if I can, but for now I'll implement it here or call a service method
    // I will create the service method next.
    const { EnrollmentService } = await import("../Enrollments/enrollment.service");
    const enrollmentService = new EnrollmentService();

    const updatedEnrollment = await enrollmentService.updateEnrollmentSchedule(parentId.toString(), enrollmentId, selectedSchedules);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Schedule updated successfully",
      data: updatedEnrollment
    });
  });
}
