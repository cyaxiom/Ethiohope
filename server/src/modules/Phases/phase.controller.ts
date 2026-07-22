import { NextFunction, Request, Response } from "express";
import { PhaseService } from "./phase.service";
import { CreatePhaseDTO, UpdatePhaseDTO } from "./phase.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class PhaseController {
  private phaseService = new PhaseService();

  /**
   * Create a new phase
   */
  public createPhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phaseData: CreatePhaseDTO = req.body;
      const createdPhase = await this.phaseService.createPhase(phaseData);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Phase created successfully",
        data: createdPhase,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get all phases for a program
   */
  public getPhasesByProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId } = req.params;
      const phases = await this.phaseService.getPhasesByProgram(programId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Phases fetched successfully",
        data: phases,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update phase details
   */
  public updatePhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phaseId = req.params.id;
      const phaseData: UpdatePhaseDTO = req.body;
      const updatedPhase = await this.phaseService.updatePhase(phaseId, phaseData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Phase updated successfully",
        data: updatedPhase,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete a phase
   */
  public deletePhase = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const phaseId = req.params.id;
      await this.phaseService.deletePhase(phaseId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Phase deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
