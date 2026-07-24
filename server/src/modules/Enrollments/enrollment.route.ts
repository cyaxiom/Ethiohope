import { Router } from "express";
import { EnrollmentController } from "./enrollment.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateEnrollmentDTO } from "./enrollment.dto";
import { authMiddleware } from "@common/middlewares/auth.middleware";

/**
 * Unified enrollments API (self + child).
 * Legacy `/parent/enrollments` remains for backward compatibility.
 */
export class EnrollmentRoute implements Routes {
  public path = "/enrollments";
  public router = Router();
  public enrollmentController = new EnrollmentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/`,
      authMiddleware as any,
      validationMiddleware(CreateEnrollmentDTO, "body"),
      this.enrollmentController.prepareEnrollment as any
    );
    this.router.get(
      `/pending`,
      authMiddleware as any,
      this.enrollmentController.getMyPendingEnrollments as any
    );
    this.router.get(
      `/mine`,
      authMiddleware as any,
      this.enrollmentController.getMyEnrollmentsForProgram as any
    );
  }
}

/** @deprecated Prefer `/enrollments` — kept so existing parent UI keeps working. */
export class ParentEnrollmentRoute implements Routes {
  public path = "/parent/enrollments";
  public router = Router();
  public enrollmentController = new EnrollmentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/`,
      authMiddleware as any,
      validationMiddleware(CreateEnrollmentDTO, "body"),
      this.enrollmentController.prepareEnrollment as any
    );
    this.router.get(
      `/pending`,
      authMiddleware as any,
      this.enrollmentController.getMyPendingEnrollments as any
    );
  }
}
