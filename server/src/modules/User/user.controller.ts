import { Request, Response } from "express";
import { UserService } from "./user.service";
import { CompleteProfileDTO, UserDTO } from "./user.dto";
import { asyncHandler } from "@common/utils/asyncHandler";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { RequestWithTokenPayload } from "@auth/auth.interface";
import { RoleModel } from "@accessControll/role.model";
import { logger } from "@utils/logger";

export class UserController {
  private userService = new UserService();

  /**
   * Endpoint to bootstrap the first Super Admin
   */
  public bootstrap = asyncHandler(async (req: Request, res: Response) => {
    logger.info("API: Processing request to bootstrap Super Admin");
    const userData: UserDTO = req.body;
    const createdUser = await this.userService.bootstrapSuperAdmin(userData);

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "Super Admin bootstrapped successfully",
      data: createdUser,
    });
  });

  public getUsers = asyncHandler(async (req: Request, res: Response) => {
    const { page = "1", limit = "10", search, role, status } = req.query;
    logger.info(`API: Fetching users list (Page: ${page}, Limit: ${limit}, Search: ${search || 'N/A'})`);
    const result = await this.userService.getUsers(
      parseInt(page as string, 10),
      parseInt(limit as string, 10),
      search as string,
      role as string,
      status as string
    );

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Users fetched successfully",
      ...result,
    });
  });

  public createUser = asyncHandler(async (req: Request, res: Response) => {
    const userData = req.body;
    logger.info(`API: Request to create new user: ${userData.email}`);
    const createdUser = await this.userService.createUser(userData);

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: createdUser,
    });
  });

  public updateUserRoles = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { roles } = req.body;
    logger.info(`API: Updating roles for user ID: ${userId}`);
    
    const updatedUser = await this.userService.updateUserRoles(userId, roles);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "User roles updated successfully",
      data: updatedUser,
    });
  });

  public updateUserStatus = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const { status } = req.body;
    logger.info(`API: Updating status for user ID: ${userId} to ${status}`);
    
    const updatedUser = await this.userService.updateUserStatus(userId, status);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  });

  public deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.id;
    logger.info(`API: Cascade Deleting user ID: ${userId}`);
    await this.userService.deleteUser(userId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "User deleted successfully",
    });
  });
}
