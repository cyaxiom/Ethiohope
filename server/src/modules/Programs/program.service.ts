import { ProgramsDao } from "./program.dao";
import { CreateProgramDTO, UpdateProgramDTO } from "./program.dto";
import { IProgram } from "./program.model";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { Types } from "mongoose";
import { logger } from "@utils/logger";
import { PhaseModel } from "@modules/Phases/phase.model";
import { BatchModel } from "@modules/Batches/batch.model";
import { CourseModel } from "@modules/Courses/course.model";
import { ScheduleModel } from "@modules/Schedule/schedule.model";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";

export class ProgramService {
  private programsDao = new ProgramsDao();

  /**
   * Create a new program
   */
  public async createProgram(programData: CreateProgramDTO): Promise<IProgram> {
    const createdProgram = await this.programsDao.createProgram(programData);

    // Auto-create Program Announcement Group
    try {
        const { ChatService } = await import("../Chat/chat.service");
        const chatService = new ChatService();
        await chatService.ensureProgramGroupExists(createdProgram._id.toString());
    } catch (err) {
        logger.error(`Failed to auto-create program chat for ${createdProgram._id}:`, err);
    }

    return createdProgram;
  }

  /**
   * Update program details
   */
  public async updateProgram(programId: string, programData: UpdateProgramDTO): Promise<IProgram> {
    logger.info(`ProgramService: Updating program ID: ${programId}`);
    if (isEmpty(programData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Update data is empty");

    const program = await this.programsDao.findById(programId);
    if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");

    const updatedProgram = await this.programsDao.update(new Types.ObjectId(programId), programData);
    if (!updatedProgram) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found during update");

    return updatedProgram;
  }

  /**
   * List all programs with pagination
   */
  public async getPrograms(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const programs = await this.programsDao.findAllPrograms(skip, limit, search);
    const total = await this.programsDao.countPrograms(search);

    return {
      data: programs,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Get a program by ID
   */
  public async getProgramById(programId: string): Promise<IProgram> {
    logger.info(`ProgramService: Fetching program ID: ${programId}`);
    if (!Types.ObjectId.isValid(programId)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid program ID");
    
    const program = await this.programsDao.findById(programId);
    if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");

    return program;
  }

  /**
   * Delete a program (with cascade)
   */
  public async deleteProgram(programId: string): Promise<IProgram> {
    logger.info(`ProgramService: Cascade Deleting program ID: ${programId}`);
    if (!Types.ObjectId.isValid(programId)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid program ID");

    const program = await this.programsDao.findById(programId);
    if (!program) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Program not found");

    const session = await Types.ObjectId.isValid(programId); // Just a placeholder for the ID check we already did

    try {
        // 1. Delete all schedules linked to batches of this program
        const batches = await BatchModel.find({ program: programId }).select('_id').lean();
        const batchIds = batches.map(b => b._id);
        if (batchIds.length > 0) {
            await ScheduleModel.deleteMany({ batch: { $in: batchIds } });
        }

        // 2. Delete all batches
        await BatchModel.deleteMany({ program: programId });

        // 3. Delete all phases
        await PhaseModel.deleteMany({ program: programId });

        // 4. Delete all courses
        await CourseModel.deleteMany({ program: programId });

        // 5. Delete all enrollments
        await EnrollmentModel.deleteMany({ program: programId });

        // 6. Delete the program itself
        const deletedProgram = await this.programsDao.delete(new Types.ObjectId(programId));
        if (!deletedProgram) throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete program");

        logger.info(`ProgramService: Successfully deleted program ${programId} and all its dependencies.`);
        return deletedProgram;
    } catch (err) {
        logger.error(`Failed to cascade delete program ${programId}:`, err);
        throw err;
    }
  }
}
