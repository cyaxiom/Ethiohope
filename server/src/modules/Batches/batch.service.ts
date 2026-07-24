import { BatchDao } from "./batch.dao";
import { CreateBatchDTO, UpdateBatchDTO } from "./batch.dto";
import { IBatch, BatchModel } from "./batch.model";
import { ProgramModel } from "@modules/Programs/program.model";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { logger } from "@utils/logger";
import { Types } from "mongoose";
import { ScheduleModel } from "@modules/Schedule/schedule.model";

import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { ChatService } from "@modules/Chat/chat.service";

export class BatchService {
  private batchDao = new BatchDao();
  private chatService = new ChatService();

  /**
   * Get all batches with pagination
   */
  public async getBatches(params: { page: number; limit: number; search?: string }) {
    const { batches, total } = await this.batchDao.findBatches(params);
    
    return {
      data: batches,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
      },
    };
  }

  /**
   * Create a new batch
   */
  public async createBatch(batchData: CreateBatchDTO): Promise<IBatch> {
    logger.info(`BatchService: Creating batch for program ${batchData.program}`);
    
    if (isEmpty(batchData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Batch data is empty");

    // 1. Check if program exists
    const program = await ProgramModel.findById(batchData.program);
    if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");

    const createdBatch = await this.batchDao.create({
      ...batchData,
      program: new Types.ObjectId(batchData.program),
      instructor: batchData.instructor ? new Types.ObjectId(batchData.instructor) : undefined
    } as any);

    // Automatically create a group chat conversation for this new batch
    try {
      await this.chatService.ensureBatchGroupExists(createdBatch._id.toString());
    } catch (err) {
      logger.error(`Failed to ensure chat group for newly created batch ${createdBatch._id}:`, err);
    }

    return createdBatch;
  }

  /**
   * Update batch
   */
  public async updateBatch(id: string, batchData: UpdateBatchDTO): Promise<IBatch> {
    logger.info(`BatchService: Updating batch ID: ${id}`);
    
    const existingBatch = await this.batchDao.findById(id);
    if (!existingBatch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Batch not found");

    // Validations if IDs are updated
    if (batchData.program) {
      const program = await ProgramModel.findById(batchData.program);
      if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");
    }

    const updatePayload: any = { ...batchData };
    if (batchData.program) updatePayload.program = new Types.ObjectId(batchData.program);
    
    // Explicitly handle instructor unassignment or conversion
    if (batchData.instructor === "" || batchData.instructor === null) {
      updatePayload.instructor = null;
    } else if (batchData.instructor) {
      updatePayload.instructor = new Types.ObjectId(batchData.instructor);
    }

    const updatedBatch = await this.batchDao.update(id, updatePayload);
    if (!updatedBatch) {
      logger.error(`BatchService: Failed to update batch ${id}`);
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update batch");
    }

    return updatedBatch;
  }

  /**
   * Delete batch
   */
  public async deleteBatch(id: string): Promise<void> {
    logger.info(`BatchService: Deleting batch ID: ${id}`);
    const deletedBatch = await this.batchDao.delete(id);
    if (!deletedBatch) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Batch not found");
  }

  /**
   * Get all batches for a specific program (with schedules)
   */
  public async getBatchesByProgram(programId: string, onlyActive: boolean = false): Promise<any[]> {
    logger.info(`BatchService: Fetching batches for program ${programId} (onlyActive: ${onlyActive})`);
    
    const query: any = { program: new Types.ObjectId(programId) };
    if (onlyActive) {
      query.isActive = true;
    }
    
    const batches = await BatchModel.find(query).lean();
    
    // Fetch schedules and enrollment counts for each batch
    const batchesWithDetails = await Promise.all(
      batches.map(async (batch) => {
        const schedules = await ScheduleModel.find({ batch: batch._id }).lean();
        const activeEnrollments = await EnrollmentModel.countDocuments({
          batch: batch._id,
          status: 'ACTIVE'
        });
        
        return {
          ...batch,
          schedules,
          activeEnrollments
        };
      })
    );

    return batchesWithDetails;
  }
}
