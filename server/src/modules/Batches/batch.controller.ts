import { NextFunction, Request, Response } from "express";
import { BatchService } from "./batch.service";
import { CreateBatchDTO, UpdateBatchDTO } from "./batch.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class BatchController {
  private batchService = new BatchService();

  /**
   * Get all batches with pagination
   */
  public getBatches = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;

      const result = await this.batchService.getBatches({ page, limit, search });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Batches fetched successfully",
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Create a new batch
   */
  public createBatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const batchData: CreateBatchDTO = req.body;
      const createdBatch = await this.batchService.createBatch(batchData);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Batch created successfully",
        data: createdBatch,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update batch details
   */
  public updateBatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const batchData: UpdateBatchDTO = req.body;
      const updatedBatch = await this.batchService.updateBatch(id, batchData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Batch updated successfully",
        data: updatedBatch,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a batch
   */
  public deleteBatch = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.batchService.deleteBatch(id);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Batch deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all batches for a specific program
   */
  public getBatchesByProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId } = req.params;
      const onlyActive = req.query.onlyActive !== 'false'; // Default to true for public consumption
      const batches = await this.batchService.getBatchesByProgram(programId, onlyActive);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Batches fetched successfully",
        data: batches
      });
    } catch (error) {
      next(error);
    }
  };
}
