import { NextFunction, Request, Response } from "express";
import { ProgramService } from "./program.service";
import { CreateProgramDTO, UpdateProgramDTO } from "./program.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class ProgramController {
  private programService = new ProgramService();

  /**
   * Create a new program
   */
  public createProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const programData: CreateProgramDTO = req.body;
      const createdProgram = await this.programService.createProgram(programData);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Program created successfully",
        data: createdProgram,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update program details
   */
  public updateProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const programId = req.params.id;
      const programData: UpdateProgramDTO = req.body;
      const updatedProgram = await this.programService.updateProgram(programId, programData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Program updated successfully",
        data: updatedProgram,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * List all programs
   */
  public getPrograms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await this.programService.getPrograms(page, limit, search);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Programs fetched successfully",
        ...result,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Get Program by ID
   */
  public getProgramById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const programId = req.params.id;
      const program = await this.programService.getProgramById(programId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Program fetched successfully",
        data: program,
      });
    } catch (error) {
      next(error);
    }
  };
  /**
   * Delete Program
   */
  public deleteProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const programId = req.params.id;
      await this.programService.deleteProgram(programId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Program deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
