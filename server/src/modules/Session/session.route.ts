import { Router } from "express";
import { SessionController } from "./session.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateSessionDTO, UpdateSessionDTO, CreateSessionFromScheduleDTO } from "./session.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class SessionRoute implements Routes {
  public path = "/sessions";
  public router = Router();
  public sessionController = new SessionController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // List sessions
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("session.read") as any,
      this.sessionController.getSessions as any
    );

    // List student sessions (RBAC filtered)
    this.router.get(
      `/student`,
      authMiddleware as any,
      this.sessionController.getStudentSessions as any
    );

    // Create session
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("session.create") as any,
      validationMiddleware(CreateSessionDTO, "body"),
      this.sessionController.createSession as any
    );

    // Create session from schedule
    this.router.post(
      `/schedule/:scheduleId`,
      authMiddleware as any,
      requirePermission("session.create") as any,
      validationMiddleware(CreateSessionFromScheduleDTO, "body"),
      this.sessionController.createSessionFromSchedule as any
    );

    // Update session
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("session.update") as any,
      validationMiddleware(UpdateSessionDTO, "body"),
      this.sessionController.updateSession as any
    );

    // Get secure join URL
    this.router.get(
      `/:id/join`,
      authMiddleware as any,
      this.sessionController.getSessionJoinUrl as any
    );

    // Delete session
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("session.delete") as any,
      this.sessionController.deleteSession as any
    );
  }
}
