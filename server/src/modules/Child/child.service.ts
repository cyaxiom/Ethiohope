import bcrypt from 'bcryptjs';
import { ChildModel, IChild } from './child.model';
import { CreateChildDTO, UpdateChildDTO } from './child.dto';
import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { logger } from '@utils/logger';
import { EnrollmentModel } from '../Enrollments/enrollment.model';

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

    // Hash the 6-digit PIN
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
   * Admin: get child by ID (any parent)
   */
  public async getChildByIdAdmin(childId: string): Promise<IChild> {
    const child = await ChildModel.findById(childId);
    if (!child) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found');
    }
    return child;
  }

  /**
   * Admin: update child profile fields
   */
  public async updateChildAdmin(childId: string, data: UpdateChildDTO): Promise<IChild> {
    const child = await ChildModel.findById(childId);
    if (!child) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found');
    }

    if (data.username && data.username.toLowerCase() !== child.username) {
      const taken = await ChildModel.findOne({
        username: data.username.toLowerCase(),
        _id: { $ne: childId },
      });
      if (taken) {
        throw new HttpException(HttpStatusCodes.BAD_REQUEST, `Username [${data.username}] is already taken.`);
      }
      child.username = data.username.toLowerCase();
    }

    if (data.firstname !== undefined) child.firstname = data.firstname;
    if (data.lastname !== undefined) child.lastname = data.lastname;
    if (data.gender !== undefined) child.gender = data.gender;
    if (data.grade !== undefined) child.grade = data.grade;
    if (data.status !== undefined) child.status = data.status;
    if (data.isUSA !== undefined) child.isUSA = data.isUSA;
    if (data.country !== undefined) child.country = data.country;
    if (data.region !== undefined) child.region = data.region;
    if (data.birthdate !== undefined) child.birthdate = new Date(data.birthdate);

    if (data.pin) {
      child.pin = await bcrypt.hash(data.pin, 10);
      child.plainPin = data.pin;
    }

    await child.save();
    logger.info(`Admin updated child profile ${child._id}`);
    return child;
  }

  /**
   * Delete a child profile (parent-scoped)
   */
  public async deleteChild(parentId: string, childId: string): Promise<void> {
    const result = await ChildModel.deleteOne({ _id: childId, parent: parentId });
    if (result.deletedCount === 0) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found or already deleted');
    }
  }

  /**
   * Admin: delete child + related enrollments (any parent)
   */
  public async deleteChildAdmin(childId: string): Promise<void> {
    const child = await ChildModel.findById(childId);
    if (!child) {
      throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Child profile not found or already deleted');
    }

    await EnrollmentModel.deleteMany({ child: childId });
    await ChildModel.deleteOne({ _id: childId });
    logger.info(`Admin deleted child ${childId} and related enrollments`);
  }
}
