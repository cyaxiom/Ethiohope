import bcrypt from 'bcryptjs';
import { ChildModel, IChild } from './child.model';
import { CreateChildDTO } from './child.dto';
import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { logger } from '@utils/logger';

export class ChildService {
  /**
   * Create a child profile under a specific parent
   */
  public async createChild(parentId: string, data: CreateChildDTO): Promise<IChild> {
    logger.info(`Creating child profile: ${data.username} for parent ID: ${parentId}`);

    // Check if username already exists
    const exists = await ChildModel.findOne({ username: data.username.toLowerCase() });
    if (exists) {
      throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Username [${data.username}] is already taken.`);
    }

    // Hash the 4-digit PIN
    const hashedPin = await bcrypt.hash(data.pin, 10);

    const child = await ChildModel.create({
      ...data,
      username: data.username.toLowerCase(),
      pin: hashedPin,
      plainPin: data.pin,
      parent: parentId,
    });

    logger.info(`Child profile ${child.username} created successfully!`);
    return child;
  }

  /**
   * Get all children for a specific parent
   */
  public async getChildrenByParent(parentId: string): Promise<IChild[]> {
    return await ChildModel.find({ parent: parentId });
  }

  /**
   * Get a specific child by ID (Must belong to the parent)
   */
  public async getChildById(parentId: string, childId: string): Promise<IChild> {
    const child = await ChildModel.findOne({ _id: childId, parent: parentId });
    if (!child) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found');
    }
    return child;
  }

  /**
   * Delete a child profile
   */
  public async deleteChild(parentId: string, childId: string): Promise<void> {
    const result = await ChildModel.deleteOne({ _id: childId, parent: parentId });
    if (result.deletedCount === 0) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found or already deleted');
    }
  }
}
