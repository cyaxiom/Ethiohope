import { Router } from "express";
import { ChildController } from "./child.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware, checkPermission } from "@middlewares/auth.middleware";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateChildDTO } from "./child.dto";

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

    // Dynamic child profile endpoints
    // DISABLING PUBLIC CHILD CREATION - This will be handled internally during Enrollment in Sprint 2
    // this.router.post(`/create`, checkPermission("child.create") as any, validationMiddleware(CreateChildDTO, "body"), this.childController.createChild as any);
    
    this.router.get(`/me`, this.childController.getMe as any); // Child gets their own info
    
    this.router.get(`/list`, checkPermission("child.read") as any, this.childController.getChildren as any); // Get parent's children
    this.router.get(`/:id`, checkPermission("child.read") as any, this.childController.getChild as any);
    this.router.delete(`/:id`, checkPermission("child.delete") as any, this.childController.deleteChild as any);
  }
}
