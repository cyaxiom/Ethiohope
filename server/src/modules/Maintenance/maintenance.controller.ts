import { Request, Response } from "express";
import { MaintenanceService } from "./maintenance.service";
import { asyncHandler } from "@common/utils/asyncHandler";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { logger } from "@utils/logger";

export class MaintenanceController {
  private maintenanceService = new MaintenanceService();

  /**
   * Endpoint to trigger database reset
   */
  public resetDatabase = asyncHandler(async (req: Request, res: Response) => {
    logger.warn(`API: Maintenance request - Database Reset triggered by user ID: ${(req as any).tokenPayload?._id}`);
    
    const result = await this.maintenanceService.resetDatabase();

    res.status(HttpStatusCodes.OK).json(result);
  });
}
