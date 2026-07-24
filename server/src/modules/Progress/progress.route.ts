import { Router } from 'express';
import { ProgressController } from './progress.controller';
import { Routes } from '@common/interfaces/route.interface';
import { authMiddleware, checkPermission } from '@middlewares/auth.middleware';
import validationMiddleware from '@common/middlewares/validation.middleware';
import { CompleteLessonDTO } from './progress.dto';

export class ProgressRoute implements Routes {
  public path = '/progress';
  public router = Router();
  public progressController = new ProgressController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use(authMiddleware as any);

    // Endpoint to mark a lesson as completed
    this.router.post(
      `/complete`,
      checkPermission('progress.update') as any,
      validationMiddleware(CompleteLessonDTO, 'body'),
      this.progressController.completeLesson as any
    );

    // Endpoint to get progress for a specific enrollment
    this.router.get(
      `/:enrollmentId`,
      checkPermission('progress.read') as any,
      this.progressController.getProgress as any
    );
  }
}
