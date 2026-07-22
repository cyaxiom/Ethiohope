import { CourseModel, ICourse } from "./course.model";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { EnrollmentModel } from "../Enrollments/enrollment.model";

export class CourseService {
  public async getStudentCourses(childId: string) {
    // 1. Get active enrollments for the child
    const enrollments = await EnrollmentModel.find({ 
      child: childId, 
      status: 'ACTIVE',
      paymentStatus: 'PAID'
    }).lean();

    if (!enrollments.length) {
      return { data: [], meta: { total: 0, page: 1, limit: 10 } };
    }

    // 2. Extract program and phase pairs
    const programPhases = enrollments.map(e => ({
      program: e.program,
      phase: e.phase
    }));

    // 3. Find courses matching these programs and phases
    const query = {
      $or: programPhases
    };

    const courses = await CourseModel.find(query)
      .populate('program', 'title')
      .populate('phase', 'title')
      .sort({ createdAt: -1 })
      .lean();

    return {
      data: courses,
      meta: {
        total: courses.length,
        page: 1,
        limit: courses.length,
      },
    };
  }

  public async getStudentCourseById(childId: string, courseId: string): Promise<{ course: ICourse; enrollmentId: string }> {
    // 1. Verify student is enrolled in the program/phase of this course
    const course = await CourseModel.findById(courseId)
      .populate('program', 'title')
      .populate('phase', 'title')
      .lean();
    
    if (!course) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Course not found");

    const enrollment = await EnrollmentModel.findOne({
      child: childId,
      program: course.program._id,
      phase: course.phase._id,
      status: 'ACTIVE',
      paymentStatus: 'PAID'
    });

    if (!enrollment) {
      throw new HttpException(HttpStatusCodes.FORBIDDEN, "You are not enrolled in this course");
    }

    return { course: course as unknown as ICourse, enrollmentId: enrollment._id.toString() };
  }

  public async getCourses(params: { page: number; limit: number; search?: string; programId?: string; phaseId?: string }) {
    const { page, limit, search, programId, phaseId } = params;
    const skip = (page - 1) * limit;

    const query: any = {};
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    if (programId) query.program = programId;
    if (phaseId) query.phase = phaseId;

    const [courses, total] = await Promise.all([
      CourseModel.find(query)
        .populate('program', 'title')
        .populate('phase', 'title')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      CourseModel.countDocuments(query),
    ]);

    return {
      data: courses,
      meta: {
        total,
        page,
        limit,
      },
    };
  }

  public async getCourseById(id: string): Promise<ICourse> {
    const course = await CourseModel.findById(id)
      .populate('program', 'title')
      .populate('phase', 'title')
      .lean();
    if (!course) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Course not found");
    return course as unknown as ICourse;
  }

  public async createCourse(courseData: CreateCourseDTO): Promise<ICourse> {
    if (isEmpty(courseData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Course data is empty");
    const createdCourse = await CourseModel.create(courseData);
    return createdCourse;
  }

  public async updateCourse(id: string, courseData: UpdateCourseDTO): Promise<ICourse> {
    if (isEmpty(courseData)) throw new HttpException(HttpStatusCodes.BAD_REQUEST, "Course data is empty");
    const updatedCourse = await CourseModel.findByIdAndUpdate(id, { $set: courseData }, { new: true });
    if (!updatedCourse) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Course not found");
    return updatedCourse;
  }

  public async deleteCourse(id: string): Promise<void> {
    const deletedCourse = await CourseModel.findByIdAndDelete(id);
    if (!deletedCourse) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Course not found");
  }
}
