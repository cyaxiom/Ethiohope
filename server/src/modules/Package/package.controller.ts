import { NextFunction, Request, Response } from 'express';
import { PackageService } from './package.service';
import { CreatePackageDTO, UpdatePackageDTO } from './package.dto';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';

export class PackageController {
  private packageService = new PackageService();

  public createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data: CreatePackageDTO = req.body;
      const created = await this.packageService.createPackage(data);
      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: 'Package created successfully',
        data: created,
      });
    } catch (error) {
      next(error);
    }
  };

  public getPackagesByProgram = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { programId } = req.params;
      const activeOnly = req.query.active === 'true' || req.query.active === '1';
      const packages = await this.packageService.getPackagesByProgram(programId, activeOnly);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'Packages fetched successfully',
        data: packages,
      });
    } catch (error) {
      next(error);
    }
  };

  public updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updated = await this.packageService.updatePackage(req.params.id, req.body as UpdatePackageDTO);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'Package updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  public deletePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.packageService.deletePackage(req.params.id);
      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: 'Package deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
