import { RoleModel } from "@accessControll/role.model";
import { UsersDao } from "./users.dao";
import { CompleteProfileDTO, UserDTO } from "./user.dto";
import { IUser } from "./user.interface";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { Types } from "mongoose";
import { User } from "./user.schema";
import { logger } from "@utils/logger";
import { EnrollmentModel } from "@modules/Enrollments/enrollment.model";
import { ChildModel } from "@modules/Child/child.model";
import { BatchModel } from "@modules/Batches/batch.model";

export class UserService {
  private usersDao = new UsersDao();

  /**
   * Complete parent profile
   */
  public async completeProfile(userId: string, data: CompleteProfileDTO): Promise<IUser> {
    logger.info(`UserService: Completing profile for user ID: ${userId}`);
    if (isEmpty(data)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Profile data is empty");

    // 1. Fetch user and parent role
    const user = await User.findById(userId);
    if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");

    const parentRole = await RoleModel.findOne({ code: 'parent' });

    // 2. Prepare updated fields
    const updateData: Partial<IUser> = {
      parentType: data.parentType,
      phone: data.phone,
      country: data.country,
      state: data.state,
      city: data.city,
      isProfileComplete: true
    };

    // 3. Update roles if parent role exists and isn't already assigned
    if (parentRole && !user.roles.includes(parentRole._id as any)) {
      updateData.roles = [...user.roles, parentRole._id as any];
    }

    // 4. Update via DAO
    const updatedUser = await this.usersDao.update(new Types.ObjectId(userId), updateData);
    if (!updatedUser) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found during update");

    return updatedUser as IUser;
  }

  /**
   * Bootstrap the system by creating the first Super Admin user.
   */
  public async bootstrapSuperAdmin(userData: UserDTO): Promise<IUser> {
    if (userData.email) {
      userData.email = userData.email.trim().toLowerCase();
    }
    logger.info(`UserService: Bootstrapping Super Admin for email: ${userData.email}`);
    if (isEmpty(userData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "User data is empty");

    // 1. Check if user already exists
    const existingUser = await this.usersDao.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(HttpStatusCodes.CONFLICT, `User with email ${userData.email} already exists`);
    }

    // 2. Fetch SUPER_ADMIN role dynamically by code
    const superAdminRole = await RoleModel.findOne({ code: "super_admin" });
    if (!superAdminRole) {
      throw new HttpException(
        HttpStatusCodes.INTERNAL_SERVER_ERROR, 
        "SUPER_ADMIN role not found. Please ensure seeders have run."
      );
    }

    // 3. Prepare user data with the resolved role ID
    const userToCreate: Partial<IUser> = {
      firstname: userData.firstname,
      lastname: userData.lastname,
      email: userData.email,
      password: userData.password, // Will be hashed by pre-save hook
      roles: [superAdminRole._id as any],
      status: "active",
      isOnline: false
    };

    // 4. Create user (Password Hashing is handled by UserSchema pre-save hook)
    const createdUser = await this.usersDao.createUser(userToCreate);

    return createdUser;
  }

  public async getUsers(page: number, limit: number, search?: string, roleCode?: string, status?: string) {
    let roleId: string | undefined = undefined;
    if (roleCode) {
      const foundRole = await RoleModel.findOne({ code: roleCode });
      if (foundRole) {
        roleId = foundRole._id.toString();
      } else {
        // If the role doesn't exist, there are no users for it
        const stats = await this.usersDao.getUserStats();
        return { data: [], meta: { total: 0, page, limit, stats } };
      }
    }

    const skip = (page - 1) * limit;
    const users = await this.usersDao.findAllUsers(skip, limit, search, roleId, status);
    const total = await this.usersDao.countUsers(search, roleId, status);
    const stats = await this.usersDao.getUserStats(); // get overall stats

    return {
      data: users.map((u: any) => ({
        id: u._id,
        name: `${u.firstname} ${u.lastname}`,
        firstname: u.firstname,
        lastname: u.lastname,
        email: u.email,
        status: u.status,
        roles: u.roles?.map((r: any) => ({ id: r._id, name: r.name, code: r.code })) || [],
      })),
      meta: {
        total,
        page,
        limit,
        stats
      },
    };
  }

  public async createUser(userData: any): Promise<any> {
    if (userData.email) {
      userData.email = userData.email.trim().toLowerCase();
    }
    logger.info(`UserService: Creating new user with email: ${userData.email}`);
    const existingUser = await this.usersDao.findByEmail(userData.email);
    if (existingUser) {
      throw new HttpException(HttpStatusCodes.CONFLICT, `User with email ${userData.email} already exists`);
    }

    const nameParts = userData.name ? userData.name.split(" ") : [];
    const firstname = userData.firstname || nameParts[0] || "Unknown";
    const lastname = userData.lastname || nameParts.slice(1).join(" ") || "Unknown";

    const userToCreate: Partial<IUser> = {
      firstname,
      lastname,
      email: userData.email,
      password: userData.password,
      roles: userData.roles.map((id: string) => new Types.ObjectId(id)) as any,
      status: "active",
      isOnline: false,
    };

    const createdUser = await this.usersDao.createUser(userToCreate);
    // don't leak password
    const { password, ...safeUser } = createdUser as any;
    return safeUser;
  }

  public async updateUserRoles(userId: string, roleIds: string[]): Promise<any> {
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");
    }

    const updatedUser = await this.usersDao.update(new Types.ObjectId(userId), {
      roles: roleIds.map((id) => new Types.ObjectId(id)) as any,
    });
    
    return updatedUser;
  }

  public async updateUserStatus(userId: string, status: "active" | "suspended" | "blocked"): Promise<any> {
    logger.info(`UserService: Updating status for user ID: ${userId} to ${status}`);
    const user = await User.findById(userId);
    if (!user) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");
    }

    const updatedUser = await this.usersDao.update(new Types.ObjectId(userId), {
      status,
    });

    return updatedUser;
  }

  /**
   * Delete user (with cascade)
   */
  public async deleteUser(userId: string): Promise<IUser> {
    logger.info(`UserService: Cascade Deleting user ID: ${userId}`);
    if (!Types.ObjectId.isValid(userId)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Invalid user ID");

    const user = await User.findById(userId);
    if (!user) throw new HttpException(HttpStatusCodes.NOT_FOUND, "User not found");

    try {
        // 1. Delete all enrollments belonging to this user (as parent)
        await EnrollmentModel.deleteMany({ parent: userId });

        // 2. Delete all children belonging to this user (as parent)
        await ChildModel.deleteMany({ parent: userId });

        // 3. Handle instructor roles: Unlink from batches
        await BatchModel.updateMany({ instructor: userId }, { $set: { instructor: null } });

        // 4. Delete the user itself
        const deletedUser = await this.usersDao.delete(new Types.ObjectId(userId));
        if (!deletedUser) throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, "Failed to delete user");

        logger.info(`UserService: Successfully deleted user ${userId} and all its dependencies.`);
        return deletedUser as IUser;
    } catch (err) {
        logger.error(`Failed to cascade delete user ${userId}:`, err);
        throw err;
    }
  }
}
