import { Router } from "express";
import { ChildController } from "./child.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware, checkPermission } from "@middlewares/auth.middleware";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { UpdateChildDTO } from "./child.dto";

export class ChildRoute implements Routes {
  public path = "/child";
  public router = Router();
  public childController = new ChildController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // Requires authentication to manage child profiles
    this.router.use(authMiddleware as any);

    this.router.get(`/me`, this.childController.getMe as any);

    this.router.get(`/list`, checkPermission("child.read") as any, this.childController.getChildren as any);
    this.router.get(`/:id`, checkPermission("child.read") as any, this.childController.getChild as any);

    // Admin manage any child account
    this.router.patch(
      `/:id`,
      checkPermission("child.update") as any,
      validationMiddleware(UpdateChildDTO, "body"),
      this.childController.updateChildAdmin as any
    );
    this.router.delete(
      `/admin/:id`,
      checkPermission("child.delete") as any,
      this.childController.deleteChildAdmin as any
    );

    // Parent-scoped delete (own children)
    this.router.delete(`/:id`, checkPermission("child.delete") as any, this.childController.deleteChild as any);
  }
}
