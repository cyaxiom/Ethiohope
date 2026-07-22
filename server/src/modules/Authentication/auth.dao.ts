import { User } from "@modules/User/user.schema";
import { IUser } from "@modules/User/user.interface";
import { Types } from "mongoose";

export class AuthDao {
  async findByEmailOrUsernamel(identifier: string): Promise<IUser | null> {
    const cleanIdentifier = identifier ? identifier.trim().toLowerCase() : identifier;
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier },
        { username: cleanIdentifier },
      ],
    })
      .select('+password')
      .lean();

    return user;
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    const createUserData = await User.create(data);

    return createUserData.toObject();
  }

  // update active user last login
  async updateLastLogin(userId: Types.ObjectId): Promise<IUser | null> {
    const updatedUser = await User.findByIdAndUpdate(userId, { $set: { isOnline: true, lastLogin: new Date() } }, { new: true }).lean();

    return updatedUser;
  }
}