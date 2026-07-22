import { Router } from "express";
import { CourseController } from "./course.controller";
import { Routes } from "@common/interfaces/route.interface";
import { authMiddleware } from "@common/middlewares/auth.middleware";

export class StudentCourseRoute implements Routes {
  public path = "/student/courses";
  public router = Router();
  public courseController = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(
      `/`,
      authMiddleware as any,
      this.courseController.getStudentCourses as any
    );

    this.router.get(
      `/:id`,
      authMiddleware as any,
      this.courseController.getStudentCourseById as any
    );
  }
}
