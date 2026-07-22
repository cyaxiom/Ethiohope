import { Router } from "express";
import { ProgramController } from "./program.controller";
import { Routes } from "@common/interfaces/route.interface";
import { PhaseController } from "@modules/Phases/phase.controller";
import { BatchController } from "@modules/Batches/batch.controller";

export class PublicProgramRoute implements Routes {
  public path = "/programs";
  public router = Router();
  public programController = new ProgramController();
  public phaseController = new PhaseController();
  public batchController = new BatchController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // List programs (publicly accessible)
    this.router.get(
      `/`,
      this.programController.getPrograms as any
    );

    // Get a specific program (publicly accessible)
    this.router.get(
      `/:id`,
      this.programController.getProgramById as any
    );

    // Get phases of a program (publicly accessible)
    this.router.get(
      `/:programId/phases`,
      this.phaseController.getPhasesByProgram as any
    );

    // Get batches of a program (publicly accessible)
    this.router.get(
      `/:programId/batches`,
      this.batchController.getBatchesByProgram as any
    );
  }
}
