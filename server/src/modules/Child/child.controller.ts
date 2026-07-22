import { Request, Response } from 'express';
import { ChildService } from './child.service';
import { asyncHandler } from '@common/utils/asyncHandler';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { RequestWithTokenPayload } from '@modules/Authentication/auth.interface';
import { EnrollmentModel } from '../Enrollments/enrollment.model';
import { ChildModel } from './child.model';
import { User } from '../User/user.schema';

export class ChildController {
  private childService = new ChildService();

  // Create a child profile for the modern parent
  public createChild = asyncHandler(async (req: Request, res: Response) => {
    const r = req as RequestWithTokenPayload;
    const parentId = r.tokenPayload._id.toString();
    const child = await this.childService.createChild(parentId, req.body);
    res.status(HttpStatusCodes.CREATED).json({ success: true, message: "Child profile created successfully", data: child });
  });

  // Get all children for the current parent
  public getChildren = asyncHandler(async (req: Request, res: Response) => {
    const r = req as RequestWithTokenPayload;
    const parentId = r.tokenPayload._id.toString();
    const children = await this.childService.getChildrenByParent(parentId);
    res.status(HttpStatusCodes.OK).json({ success: true, data: children });
  });

  // Get a specific child profile (must be parent of it)
  public getChild = asyncHandler(async (req: Request, res: Response) => {
    const r = req as RequestWithTokenPayload;
    const parentId = r.tokenPayload._id.toString();
    const { id } = req.params;
    const child = await this.childService.getChildById(parentId, id);
    res.status(HttpStatusCodes.OK).json({ success: true, data: child });
  });

  // Delete a child profile
  public deleteChild = asyncHandler(async (req: Request, res: Response) => {
    const r = req as RequestWithTokenPayload;
    const parentId = r.tokenPayload._id.toString();
    const { id } = req.params;
    await this.childService.deleteChild(parentId, id);
    res.status(HttpStatusCodes.OK).json({ success: true, message: "Child profile deleted successfully" });
  });

  // Get current child profile & enrollments (Student Dashboard)
  public getMe = asyncHandler(async (req: Request, res: Response) => {
    const r = req as RequestWithTokenPayload;
    const childId = r.tokenPayload._id.toString();

    const child = await ChildModel.findById(childId).lean();
    if (!child) {
      return res.status(HttpStatusCodes.NOT_FOUND).json({ success: false, message: "Child not found" });
    }

    const parent = await User.findById(child.parent).select('firstname lastname').lean();

    const activeEnrollments = await EnrollmentModel.find({ child: childId, status: 'ACTIVE' }).populate('program phase batch').lean();

    res.status(HttpStatusCodes.OK).json({
      success: true,
      data: {
        ...child,
        parentName: parent ? `${parent.firstname}` : 'Your parent',
        hasActiveEnrollment: activeEnrollments.length > 0,
        activeEnrollments
      }
    });
  });
}
