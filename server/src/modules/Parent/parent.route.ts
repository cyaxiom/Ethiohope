import { Router } from "express";
import { ParentController } from "./parent.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CompleteProfileDTO } from "@modules/User/user.dto";
import { authMiddleware, checkPermission } from "@common/middlewares/auth.middleware";

export class ParentRoute implements Routes {
  public path = "/parent";
  public router = Router();
  public parentController = new ParentController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Parent profile completion - requires authentication
    // POST /parent/complete-profile
    this.router.post(`/complete-profile`, authMiddleware as any, validationMiddleware(CompleteProfileDTO, "body"), this.parentController.completeProfile as any);

    // Init child registration flow
    this.router.get(`/register-child/init`, authMiddleware as any, this.parentController.initRegistration as any);

    // Register child without initial enrollment
    this.router.post(`/children`, authMiddleware as any, this.parentController.registerChild as any);

    // Get parent's children
    this.router.get(`/children`, authMiddleware as any, this.parentController.getChildren as any);

    // Get specific child details
    this.router.get(`/children/:id`, authMiddleware as any, this.parentController.getChildDetails as any);

    // Dashboard stats
    this.router.get(
      `/dashboard/stats`, 
      authMiddleware as any, 
      checkPermission('dashboard.parent') as any,
      this.parentController.getDashboardStats as any
    );

    // Update enrollment schedule
    this.router.patch(
      `/enrollments/:enrollmentId/schedule`,
      authMiddleware as any,
      this.parentController.updateEnrollmentSchedule as any
    );
  }
}
