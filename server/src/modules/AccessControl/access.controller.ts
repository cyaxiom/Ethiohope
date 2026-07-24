import { Request, Response } from "express";
import { AccessService } from "./access.service";
import { asyncHandler } from "@common/utils/asyncHandler";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class AccessController {
  private accessService = new AccessService();

  public getPermissions = asyncHandler(async (req: Request, res: Response) => {
    const permissions = await this.accessService.getPermissions();
    res.status(HttpStatusCodes.OK).json({ success: true, data: permissions });
  });

  public getRoles = asyncHandler(async (req: Request, res: Response) => {
    const roles = await this.accessService.getRoles();
    res.status(HttpStatusCodes.OK).json({ success: true, data: roles });
  });

  public createRole = asyncHandler(async (req: Request, res: Response) => {
    const role = await this.accessService.createRole(req.body);
    res.status(HttpStatusCodes.CREATED).json({ success: true, message: "Role created successfully", data: role });
  });

  public updatePermissions = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { permissionKeys } = req.body;
    const role = await this.accessService.updateRolePermissions(id, permissionKeys);
    res.status(HttpStatusCodes.OK).json({ success: true, message: "Role updated successfully", data: role });
  });

  public deleteRole = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const isSuperAdmin = (req as any).isSuperAdmin === true;
    await this.accessService.deleteRole(id, isSuperAdmin);
    res.status(HttpStatusCodes.OK).json({ success: true, message: "Role deleted successfully" });
  });
}
