import { Router } from "express";
import { CourseController } from "./course.controller";
import { Routes } from "@common/interfaces/route.interface";
import validationMiddleware from "@common/middlewares/validation.middleware";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto";
import { authMiddleware, requirePermission } from "@common/middlewares/auth.middleware";

export class CourseRoute implements Routes {
  public path = "/admin/courses";
  public router = Router();
  public courseController = new CourseController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // 1. List courses
    this.router.get(
      `/`,
      authMiddleware as any,
      requirePermission("course.read") as any,
      this.courseController.getCourses as any
    );

    // 2. Get course by ID
    this.router.get(
      `/:id`,
      authMiddleware as any,
      requirePermission("course.read") as any,
      this.courseController.getCourseById as any
    );

    // 3. Create course
    this.router.post(
      `/`,
      authMiddleware as any,
      requirePermission("course.create") as any,
      validationMiddleware(CreateCourseDTO, "body", false, true, false),
      this.courseController.createCourse as any
    );

    // 4. Update course
    this.router.patch(
      `/:id`,
      authMiddleware as any,
      requirePermission("course.update") as any,
      validationMiddleware(UpdateCourseDTO, "body", true, true, false),
      this.courseController.updateCourse as any
    );

    // 5. Delete course
    this.router.delete(
      `/:id`,
      authMiddleware as any,
      requirePermission("course.delete") as any,
      this.courseController.deleteCourse as any
    );
  }
}
