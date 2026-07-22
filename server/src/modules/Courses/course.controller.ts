import { NextFunction, Request, Response } from "express";
import { CourseService } from "./course.service";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";

export class CourseController {
  private courseService = new CourseService();

  public getStudentCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const childId = (req as any).tokenPayload._id;
      const result = await this.courseService.getStudentCourses(childId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Student courses fetched successfully",
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  public getStudentCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const childId = (req as any).tokenPayload._id;
      const courseId = req.params.id;
      const { course, enrollmentId } = await this.courseService.getStudentCourseById(childId, courseId);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: course,
        enrollmentId,
      });
    } catch (error) {
      next(error);
    }
  };

  public getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = req.query.search as string;
      const programId = req.query.programId as string;
      const phaseId = req.query.phaseId as string;

      const result = await this.courseService.getCourses({ page, limit, search, programId, phaseId });

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Courses fetched successfully",
        ...result
      });
    } catch (error) {
      next(error);
    }
  };

  public getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const course = await this.courseService.getCourseById(id);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        data: course,
      });
    } catch (error) {
      next(error);
    }
  };

  public createCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseData: CreateCourseDTO = req.body;
      const createdCourse = await this.courseService.createCourse(courseData);

      res.status(HttpStatusCodes.CREATED).json({
        success: true,
        message: "Course created successfully",
        data: createdCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public updateCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      const courseData: UpdateCourseDTO = req.body;
      const updatedCourse = await this.courseService.updateCourse(id, courseData);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Course updated successfully",
        data: updatedCourse,
      });
    } catch (error) {
      next(error);
    }
  };

  public deleteCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      await this.courseService.deleteCourse(id);

      res.status(HttpStatusCodes.OK).json({
        success: true,
        message: "Course deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  };
}
