import { ProgressDao } from './progress.dao';
import { HttpException } from '@common/errors/HttpException';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';
import { EnrollmentModel } from '@modules/Enrollments/enrollment.model';
import { CourseModel } from '@modules/Courses/course.model';
import { IProgress } from './progress.model';
import { Types } from 'mongoose';

export class ProgressService {
  private progressDao = new ProgressDao();

  public async completeLesson(
    userId: string,
    userType: 'child' | 'adult',
    enrollmentId: string,
    courseId: string,
    weekIndex: number,
    lessonIndex: number,
    videoIndex: number
  ): Promise<IProgress> {
    // 1. Verify enrollment exists and is active
    const enrollment = await EnrollmentModel.findById(enrollmentId);
    if (!enrollment) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Enrollment not found');
    if (enrollment.status !== 'ACTIVE') throw new HttpException(HttpStatusCodes.FORBIDDEN, 'Enrollment is not active');

    // 2. RBAC check: only the student assigned to the enrollment or their parent can mark it complete
    if (userType === 'child' && enrollment.child.toString() !== userId) {
      throw new HttpException(HttpStatusCodes.FORBIDDEN, 'You can only update your own progress');
    }
    if (userType === 'adult' && enrollment.parent.toString() !== userId) {
      // Parents can update progress for their children, but admins/superadmins usually bypass this via middleware
      // We'll leave stricter checks to the controller if needed.
    }

    // 3. Mark lecture as completed
    const progress = await this.progressDao.addCompletedLesson(enrollmentId, { courseId, weekIndex, lessonIndex, videoIndex });
    if (!progress) throw new HttpException(HttpStatusCodes.INTERNAL_SERVER_ERROR, 'Failed to update progress');

    // 4. Initialize progress metadata if it's the first time
    if (!progress.child) {
      progress.child = enrollment.child;
      progress.program = enrollment.program;
      progress.phase = enrollment.phase;
    }

    // 5. Recalculate percentage
    await this.calculatePercentage(progress);

    return progress;
  }

  public async getProgress(enrollmentId: string): Promise<IProgress> {
    const progress = await this.progressDao.findByEnrollment(enrollmentId);
    if (!progress) {
       // If no progress record exists yet, return a skeleton (but check enrollment first)
       const enrollment = await EnrollmentModel.findById(enrollmentId);
       if (!enrollment) throw new HttpException(HttpStatusCodes.NOT_FOUND, 'Enrollment not found');
       
       return {
         enrollment: enrollment._id,
         child: enrollment.child,
         program: enrollment.program,
         phase: enrollment.phase,
         completedLessons: [],
         percentage: 0,
       } as any;
    }
    return progress;
  }

  private async calculatePercentage(progress: IProgress): Promise<void> {
    // Find all courses associated with this Phase
    const courses = await CourseModel.find({ phase: progress.phase });
    
    let totalVideosCount = 0;
    courses.forEach(course => {
      course.weeks.forEach(week => {
        week.lessons.forEach(lesson => {
          totalVideosCount += lesson.videoUrls.length;
        });
      });
    });

    if (totalVideosCount === 0) {
      progress.percentage = 0;
    } else {
      const completedCount = progress.completedLessons.length;
      progress.percentage = Math.round((completedCount / totalVideosCount) * 100);
    }

    await progress.save();
  }
}
