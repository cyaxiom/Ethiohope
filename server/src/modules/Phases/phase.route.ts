import { Router } from "express";
import { PhaseController } from "./phase.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreatePhaseDTO, UpdatePhaseDTO } from "./phase.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class PhaseRoute implements Routes {
  public path = "/admin/phases";
  public router = Router();
  public phaseController = new PhaseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 1. Create Phase
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("phase.create") as any,
      validationMiddleware(CreatePhaseDTO, "body"),
      this.phaseController.createPhase as any
    );

    // 2. Update Phase
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("phase.update") as any,
      validationMiddleware(UpdatePhaseDTO, "body"),
      this.phaseController.updatePhase as any
    );

    // 3. Delete Phase
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("phase.delete") as any,
      this.phaseController.deletePhase as any
    );
  }
}
