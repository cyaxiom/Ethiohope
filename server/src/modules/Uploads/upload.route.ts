import { Router } from 'express';
import { Routes } from '@common/interfaces/route.interface';
import { UploadController } from './upload.controller';
import { uploadMiddleware } from '@middlewares/upload.middleware';
import { authMiddleware } from '@common/middlewares/auth.middleware';

export class UploadRoute implements Routes {
  public path = '/upload';
  public router = Router();
  public uploadController = new UploadController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     * POST /api/v1/upload/:category
     * Requires authentication
     */
    this.router.post(
      '/:category',
      authMiddleware as any,
      uploadMiddleware.single('file'),
      this.uploadController.uploadFile as any
    );
  }
}
