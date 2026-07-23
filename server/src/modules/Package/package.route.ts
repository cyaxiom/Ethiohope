import { Router } from 'express';
import { PackageController } from './package.controller';
import { Routes } from '@common/interfaces/route.interface';
import validationMiddleware from '@common/middlewares/validation.middleware';
import { CreatePackageDTO, UpdatePackageDTO } from './package.dto';
import { authMiddleware, requirePermission } from '@common/middlewares/auth.middleware';

export class PackageRoute implements Routes {
  public path = '/admin/packages';
  public router = Router();
  public packageController = new PackageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission('program.update') as any,
      validationMiddleware(CreatePackageDTO, 'body'),
      this.packageController.createPackage as any
    );

    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission('program.update') as any,
      validationMiddleware(UpdatePackageDTO, 'body'),
      this.packageController.updatePackage as any
    );

    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission('program.update') as any,
      this.packageController.deletePackage as any
    );
  }
}
