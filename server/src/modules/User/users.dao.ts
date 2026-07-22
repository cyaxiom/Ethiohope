import { User } from "./user.schema";
import { IUser } from "./user.interface";
import { Types } from "mongoose";

export class UsersDao {
  /**
   * Find a user by their email address
   */
  public async findByEmail(email: string): Promise<IUser | null> {
    const cleanEmail = email ? email.trim().toLowerCase() : email;
    const user = await User.findOne({ email: cleanEmail }).select("+password").lean();
    return user as IUser | null;
  }

  /**
   * Persist a new user to the database
   * Note: Password hashing is handled automatically by the Schema middleware
   */
  public async createUser(data: Partial<IUser>): Promise<IUser> {
    const user = await User.create(data);
    return user.toObject();
  }

  /**
   * Update user details
   */
  public async update(userId: Types.ObjectId, data: Partial<IUser>): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: data }, { new: true }).lean();
    return updatedUser as IUser | null;
  }
  public async findById(userId: string): Promise<IUser | null> {
    const user = await User.findById(userId).populate('roles', 'name code').lean();
    return user as IUser | null;
  }

  public async findAllUsers(
    skip: number,
    limit: number,
    search?: string,
    role?: string,
    status?: string
  ): Promise<IUser[]> {
    const query: any = {};
    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.roles = role;
    }
    if (status) {
      query.status = status;
    }
    
    return await User.find(query)
      .skip(skip)
      .limit(limit)
      .populate("roles", "name code")
      .select("-password")
      .lean() as unknown as IUser[];
  }

  public async getUserStats(): Promise<any> {
    const total = await User.countDocuments();
    const active = await User.countDocuments({ status: "active" });
    const suspended = await User.countDocuments({ status: "suspended" });
    const blocked = await User.countDocuments({ status: "blocked" });

    const rolesCountAgg = await User.aggregate([
      { $unwind: "$roles" },
      {
        $lookup: {
          from: "roles", // Assuming the collection name is 'roles'
          localField: "roles",
          foreignField: "_id",
          as: "roleObj"
        }
      },
      { $unwind: "$roleObj" },
      {
        $group: {
          _id: "$roleObj.name",
          count: { $sum: 1 }
        }
      }
    ]);

    const rolesCount = rolesCountAgg.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    return { total, active, suspended, blocked, rolesCount };
  }

  public async countUsers(search?: string, role?: string, status?: string): Promise<number> {
    const query: any = {};
    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.roles = role;
    }
    if (status) {
      query.status = status;
    }
    return await User.countDocuments(query);
  }

  /**
   * Delete user
   */
  public async delete(userId: Types.ObjectId): Promise<IUser | null> {
    const deletedUser = await User.findByIdAndDelete(userId).lean();
    return deletedUser as IUser | null;
  }
}
