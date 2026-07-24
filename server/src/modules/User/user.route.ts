import { Router } from "express";
import { UserController } from "./user.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CompleteProfileDTO, UserDTO } from "./user.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";
export class UserRoute implements Routes {
  public path = "/users";
  public router = Router();
  public userController = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Bootstrap route - creation of the initial Super Admin
    this.router.post(`/bootstrap`, validationMiddleware(UserDTO, "body"), this.userController.bootstrap);

    // ==========================================
    // USER MANAGEMENT & RBAC ROUTES
    // ==========================================

    // Get all users (paginated)
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("user.read") as any,
      this.userController.getUsers as any
    );

    // Create a new user
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("user.create") as any,
      this.userController.createUser as any
    );

    // Update user roles
    this.router.patch(
      `/:id/roles`,
      authMiddleware as any,
      requirePermission("user.update") as any,
      this.userController.updateUserRoles as any
    );

    // Update user status
    this.router.patch(
      `/:id/status`,
      authMiddleware as any,
      requirePermission("user.update") as any,
      this.userController.updateUserStatus as any
    );

    // Delete user
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("user.delete") as any,
      this.userController.deleteUser as any
    );
  }
}
