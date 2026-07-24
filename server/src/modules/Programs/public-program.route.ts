import { Router } from "express";
import { ProgramController } from "./program.controller";
import { Routes } from "@common/interfaces/route.interface";
import { PhaseController } from "@modules/Phases/phase.controller";
import { BatchController } from "@modules/Batches/batch.controller";
import { PackageController } from "@modules/Package/package.controller";

export class PublicProgramRoute implements Routes {
  public path = "/programs";
  public router = Router();
  public programController = new ProgramController();
  public phaseController = new PhaseController();
  public batchController = new BatchController();
  public packageController = new PackageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`/`, this.programController.getPrograms as any);
    this.router.get(`/:id`, this.programController.getProgramById as any);
    this.router.get(`/:programId/phases`, this.phaseController.getPhasesByProgram as any);
    this.router.get(`/:programId/packages`, this.packageController.getPackagesByProgram as any);
    this.router.get(`/:programId/batches`, this.batchController.getBatchesByProgram as any);
  }
}
