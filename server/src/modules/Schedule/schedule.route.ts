import { Router } from "express";
import { ScheduleController } from "./schedule.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateScheduleDTO, UpdateScheduleDTO } from "./schedule.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class ScheduleRoute implements Routes {
  public path = "/admin/schedules";
  public router = Router();
  public scheduleController = new ScheduleController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 1. List schedules
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("schedule.read") as any,
      this.scheduleController.getSchedules as any
    );

    // 2. Create schedule
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("schedule.create") as any,
      validationMiddleware(CreateScheduleDTO, "body"),
      this.scheduleController.createSchedule as any
    );

    // 3. Update schedule
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("schedule.update") as any,
      validationMiddleware(UpdateScheduleDTO, "body"),
      this.scheduleController.updateSchedule as any
    );

    // 4. Delete schedule
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("schedule.delete") as any,
      this.scheduleController.deleteSchedule as any
    );
  }
}
