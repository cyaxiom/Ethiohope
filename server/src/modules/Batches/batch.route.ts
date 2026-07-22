import { Router } from "express";
import { BatchController } from "./batch.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateBatchDTO, UpdateBatchDTO } from "./batch.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class BatchRoute implements Routes {
  public path = "/admin/batches";
  public router = Router();
  public batchController = new BatchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 1. List batches
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("batch.read") as any,
      this.batchController.getBatches as any
    );

    // 2. Create batch
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("batch.create") as any,
      validationMiddleware(CreateBatchDTO, "body"),
      this.batchController.createBatch as any
    );

    // 3. Update batch
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("batch.update") as any,
      validationMiddleware(UpdateBatchDTO, "body"),
      this.batchController.updateBatch as any
    );

    // 4. Delete batch
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("batch.delete") as any,
      this.batchController.deleteBatch as any
    );
  }
}
