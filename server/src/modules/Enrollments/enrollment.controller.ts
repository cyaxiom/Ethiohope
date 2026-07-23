import { NextFunction, Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class EnrollmentController {
  private enrollmentService = new EnrollmentService();

  public prepareEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).tokenPayload._id;
      const enrollmentData: CreateEnrollmentDTO = req.body;
      
      const enrollments = await this.enrollmentService.prepareEnrollment(userId, enrollmentData);
      
      const totalAmount = enrollments.reduce((sum, e) => sum + e.amount, 0);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Enrollments prepared successfully. Proceed to payment.",
        data: {
          enrollmentIds: enrollments.map(e => e._id),
          count: enrollments.length,
          totalAmount: totalAmount,
          paymentStatus: enrollments[0].paymentStatus
        }
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyPendingEnrollments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).tokenPayload._id;
      const enrollments = await this.enrollmentService.getMyPendingEnrollments(userId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  };

  public getMyEnrollmentsForProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).tokenPayload._id;
      const programId = req.query.programId as string;
      if (!programId) {
        res.status(HttpStatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'programId is required',
          data: null,
        });
        return;
      }

      const enrollments = await this.enrollmentService.getMyEnrollmentsForProgram(userId, programId);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: enrollments,
      });
    } catch (error) {
      next(error);
    }
  };
}
