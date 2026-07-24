import { CourseModel, ICourse } from "./course.model";
import { CreateCourseDTO, UpdateCourseDTO } from "./course.dto";
import { HttpException } from "@common/errors/HttpException";
import HttpStatusCodes from "@common/utils/HttpStatusCodes";
import { isEmpty } from "@common/utils/util";
import { EnrollmentModel } from "../Enrollments/enrollment.model";

export class CourseService {
  public async getStudentCourses(learnerId: string) {
    // Include unpaid pending enrollments so the dashboard can show locked courses
    const enrollments = await EnrollmentModel.find({
      $or: [{ child: learnerId }, { user: learnerId }],
      status: { $in: ['PENDING', 'ACTIVE', 'COMPLETED'] },
    })
      .populate('program', 'title image')
      .populate('phase', 'title durationWeeks price orderIndex')
      .lean();

    if (!enrollments.length) {
      return { data: [], meta: { total: 0, page: 1, limit: 10 } };
    }

    // Prefer a paid enrollment when multiple exist for the same program/phase
    const enrollmentByKey = new Map<string, any>();
    for (const e of enrollments) {
      const programId = (e.program as any)?._id?.toString() || e.program?.toString();
      const phaseId = (e.phase as any)?._id?.toString() || e.phase?.toString();
      const key = `${programId}:${phaseId}`;
      const existing = enrollmentByKey.get(key);
      const ePaid = e.paymentStatus === 'PAID';
      if (!existing || (ePaid && existing.paymentStatus !== 'PAID')) {
        enrollmentByKey.set(key, e);
      }
    }

    const programPhases = [...enrollmentByKey.values()].map(e => ({
      program: (e.program as any)?._id || e.program,
      phase: (e.phase as any)?._id || e.phase,
    }));

    const courses = await CourseModel.find({ $or: programPhases })
      .populate('program', 'title image')
      .populate('phase', 'title durationWeeks price orderIndex')
      .sort({ createdAt: -1 })
      .lean();

    const coveredKeys = new Set<string>();
    const data: any[] = courses.map((course: any) => {
      const key = `${course.program._id.toString()}:${course.phase._id.toString()}`;
      coveredKeys.add(key);
      const enrollment = enrollmentByKey.get(key);
      const isPaid = enrollment?.paymentStatus === 'PAID';

      return {
        ...course,
        enrollmentId: enrollment?._id?.toString(),
        paymentStatus: enrollment?.paymentStatus || 'UNPAID',
        enrollmentStatus: enrollment?.status || 'PENDING',
        isLocked: !isPaid,
        isPlaceholder: false,
      };
    });

    // Enrollments with no curriculum yet still appear as locked cards (so unpaid apps show up)
    for (const [key, enrollment] of enrollmentByKey.entries()) {
      if (coveredKeys.has(key)) continue;

      const program = enrollment.program as any;
      const phase = enrollment.phase as any;
      const isPaid = enrollment.paymentStatus === 'PAID';

      data.push({
        _id: `enrollment-${enrollment._id}`,
        title: phase?.title || 'Course coming soon',
        description: program?.title
          ? `Your enrollment in ${program.title}${phase?.title ? ` — ${phase.title}` : ''} is ready. Course materials will appear here once published.`
          : 'Course materials will appear here once published.',
        thumbnail: program?.image || '',
        program: program?._id
          ? { _id: program._id, title: program.title || 'Program' }
          : { _id: enrollment.program, title: 'Program' },
        phase: phase?._id
          ? { _id: phase._id, title: phase.title || 'Phase' }
          : { _id: enrollment.phase, title: 'Phase' },
        weeks: [],
        isActive: true,
        enrollmentId: enrollment._id.toString(),
        paymentStatus: enrollment.paymentStatus || 'UNPAID',
        enrollmentStatus: enrollment.status || 'PENDING',
        isLocked: !isPaid,
        isPlaceholder: true,
        createdAt: enrollment.createdAt,
        updatedAt: enrollment.updatedAt,
      });
    }

    data.sort((a, b) => {
      // Unlocked first, then unpaid locked, then by date
      if (a.isLocked !== b.isLocked) return a.isLocked ? 1 : -1;
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    return {
      data,
      meta: {
        total: data.length,
        page: 1,
        limit: data.length,
      },
    };
  }

  public async getStudentCourseById(learnerId: string, courseId: string): Promise<{ course: ICourse; enrollmentId: string }> {
    const course = await CourseModel.findById(courseId)
      .populate('program', 'title')
      .populate('phase', 'title')
      .lean();

    if (!course) throw new HttpException(HttpStatusCodes.NOT_FOUND, "Course not found");

    const paidEnrollment = await EnrollmentModel.findOne({
      $or: [{ child: learnerId }, { user: learnerId }],
      program: (course.program as any)._id,
      phase: (course.phase as any)._id,
      status: { $in: ['ACTIVE', 'COMPLETED'] },
      paymentStatus: 'PAID',
    });

    if (paidEnrollment) {
      return { course: course as unknown as ICourse, enrollmentId: paidEnrollment._id.toString() };
    }

    const unpaidEnrollment = await EnrollmentModel.findOne({
      $or: [{ child: learnerId }, { user: learnerId }],
      program: (course.program as any)._id,
      phase: (course.phase as any)._id,
      status: { $in: ['PENDING', 'ACTIVE', 'COMPLETED'] },
    });

    if (unpaidEnrollment) {
      throw new HttpException(
        HttpStatusCodes.PAYMENT_REQUIRED,
        "Payment required to access this course. Please complete payment first."
      );
    }

    throw new HttpException(HttpStatusCodes.FORBIDDEN, "You are not enrolled in this course");
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
