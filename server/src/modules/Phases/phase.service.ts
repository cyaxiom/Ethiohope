import { PhaseDao } from "./phase.dao";
import { CreatePhaseDTO, UpdatePhaseDTO } from "./phase.dto";
import { IPhase } from "./phase.model";
import { ProgramModel } from "@modules/Programs/program.model";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { logger } from "@utils/logger";

import { Types } from "mongoose";

export class PhaseService {
  private phaseDao = new PhaseDao();

  /**
   * Create a new phase
   */
  public async createPhase(phaseData: CreatePhaseDTO): Promise<IPhase> {
    logger.info(`PhaseService: Attempting to create phase '${phaseData.title}' for program ${phaseData.program}`);
    
    if (isEmpty(phaseData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Phase data is empty");

    // 1. Check if program exists
    const program = await ProgramModel.findById(phaseData.program);
    if (!program) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, `Program with ID ${phaseData.program} not found`);
    }

    // 2. Enforce orderIndex uniqueness within the same program
    const existingPhase = await this.phaseDao.findByOrderIndex(phaseData.program, phaseData.orderIndex);
    if (existingPhase) {
      throw new HttpException(
        HttpStatusCodes.CONFLICT, 
        `A phase with order Index ${phaseData.orderIndex} already exists for this program`
      );
    }

    // 3. Create phase with correctly typed program ID
    const phaseToCreate: Partial<IPhase> = {
      ...phaseData,
      program: new Types.ObjectId(phaseData.program) as any
    };

    const createdPhase = await this.phaseDao.createPhase(phaseToCreate);
    return createdPhase;
  }

  /**
   * Get all phases for a program
   */
  public async getPhasesByProgram(programId: string): Promise<IPhase[]> {
    logger.info(`PhaseService: Fetching phases for program ${programId}`);
    
    // Check if program exists
    const program = await ProgramModel.findById(programId);
    if (!program) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, `Program with ID ${programId} not found`);
    }

    return await this.phaseDao.findByProgramId(programId);
  }

  /**
   * Update phase details
   */
  public async updatePhase(phaseId: string, phaseData: UpdatePhaseDTO): Promise<IPhase> {
    logger.info(`PhaseService: Updating phase ID: ${phaseId}`);
    if (isEmpty(phaseData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Update data is empty");

    const phase = await this.phaseDao.findById(phaseId);
    if (!phase) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Phase not found");

    // If orderIndex is being updated, check for conflicts
    if (phaseData.orderIndex !== undefined && phaseData.orderIndex !== phase.orderIndex) {
      const conflictPhase = await this.phaseDao.findByOrderIndex(phase.program.toString(), phaseData.orderIndex);
      if (conflictPhase && conflictPhase._id.toString() !== phaseId) {
        logger.warn(`PhaseService: Order index conflict for program ${phase.program} at index ${phaseData.orderIndex}`);
        throw new HttpException(
          HttpStatusCodes.CONFLICT, 
          `A phase with order Index ${phaseData.orderIndex} already exists for this program`
        );
      }
    }

    const updatedPhase = await this.phaseDao.update(new Types.ObjectId(phaseId), phaseData as any);
    if (!updatedPhase) {
      logger.error(`PhaseService: Failed to update phase ${phaseId}`);
      throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to update phase");
    }

    return updatedPhase;
  }

  /**
   * Delete a phase
   */
  public async deletePhase(phaseId: string): Promise<void> {
    logger.info(`PhaseService: Deleting phase ID: ${phaseId}`);
    const deletedPhase = await this.phaseDao.delete(phaseId);
    if (!deletedPhase) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Phase not found");
  }
}
