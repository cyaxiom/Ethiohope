import { Router } from "express";
import { ProgramController } from "./program.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateProgramDTO, UpdateProgramDTO } from "./program.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";
import { PhaseController } from "@modules/Phases/phase.controller";
import { PackageController } from "@modules/Package/package.controller";

export class ProgramRoute implements Routes {
  public path = "/admin/programs";
  public router = Router();
  public programController = new ProgramController();
  public phaseController = new PhaseController();
  public packageController = new PackageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // List programs
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("program.read") as any,
      this.programController.getPrograms as any
    );

    // Get phases of a program
    this.router.get(
      `/:programId/phases`,
      authMiddleware as any,
      requirePermission("phase.read") as any,
      this.phaseController.getPhasesByProgram as any
    );

    // Get packages of a program (Academic Tutorial)
    this.router.get(
      `/:programId/packages`,
      authMiddleware as any,
      requirePermission("program.read") as any,
      this.packageController.getPackagesByProgram as any
    );

    // Create a new program
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("program.create") as any,
      validationMiddleware(CreateProgramDTO, "body"),
      this.programController.createProgram as any
    );

    // Update program
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("program.update") as any,
      validationMiddleware(UpdateProgramDTO, "body"),
      this.programController.updateProgram as any
    );

    // Delete program
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("program.delete") as any,
      this.programController.deleteProgram as any
    );
  }
}
