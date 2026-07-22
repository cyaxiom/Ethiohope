import { Router } from "express";
import { AccessController } from "./access.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware, checkPermission } from "@middlewares/auth.middleware";

export class AccessRoute implements Routes {
  public path = "/access";
  public router = Router();
  public accessController = new AccessController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // All routes require authentication
    this.router.use(authMiddleware as any);

    // Role CRUD protected by permission keys
    this.router.get(`/permissions`, checkPermission("role.read") as any, this.accessController.getPermissions as any);
    this.router.get(`/roles`, checkPermission("role.read") as any, this.accessController.getRoles as any);
    this.router.post(`/roles`, checkPermission("role.create") as any, this.accessController.createRole as any);
    this.router.patch(`/roles/:id`, checkPermission("role.update") as any, this.accessController.updatePermissions as any);
    this.router.delete(`/roles/:id`, checkPermission("role.delete") as any, this.accessController.deleteRole as any);
  }
}
