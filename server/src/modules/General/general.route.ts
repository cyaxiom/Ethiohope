import { Router } from "express";
import { GeneralController } from "./general.controller";
import { Routes } from "@common/interfaces/route.interface";

export class GeneralRoute implements Routes {
  public path = "/general";
  public router = Router();
  public generalController = new GeneralController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * SUBMIT CONTACT FORM
     * Publicly accessible
     */
    this.router.post(
      `/contact`,
      this.generalController.submitContactForm as any
    );
  }
}
