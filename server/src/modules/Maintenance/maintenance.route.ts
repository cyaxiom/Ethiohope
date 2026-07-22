import { Router } from "express";
import { MaintenanceController } from "./maintenance.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class MaintenanceRoute implements Routes {
  public path = "/maintenance";
  public router = Router();
  public maintenanceController = new MaintenanceController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * RESET DATABASE
     * Strictly restricted to system.reset permission
     */
    this.router.post(
      `/reset-db`,
      authMiddleware as any,
      requirePermission("system.reset") as any,
      this.maintenanceController.resetDatabase as any
    );
  }
}
