import { NextFunction, Request, Response } from "express";
import { EnrollmentService } from "./enrollment.service";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class EnrollmentController {
  private enrollmentService = new EnrollmentService();

  public prepareEnrollment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parentId = (req as any).tokenPayload._id;
      const enrollmentData: CreateEnrollmentDTO = req.body;
      
      const enrollments = await this.enrollmentService.prepareEnrollment(parentId, enrollmentData);
      
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
      const parentId = (req as any).tokenPayload._id;
      const enrollments = await this.enrollmentService.getMyPendingEnrollments(parentId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: enrollments
      });
    } catch (error) {
      next(error);
    }
  };
}
