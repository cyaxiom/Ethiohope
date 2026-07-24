import { ProgressModel, IProgress } from './progress.model';
import { Types } from 'mongoose';

export class ProgressDao {
  public async findByEnrollment(enrollmentId: string): Promise<IProgress | null> {
    return await ProgressModel.findOne({ enrollment: new Types.ObjectId(enrollmentId) });
  }

  public async findByChild(childId: string): Promise<IProgress[]> {
    return await ProgressModel.find({ child: new Types.ObjectId(childId) });
  }

  public async createProgress(data: Partial<IProgress>): Promise<IProgress> {
    return await ProgressModel.create(data);
  }

  public async updateProgress(id: string, data: Partial<IProgress>): Promise<IProgress | null> {
    return await ProgressModel.findByIdAndUpdate(id, { $set: data }, { new: true });
  }

  public async addCompletedLesson(
    enrollmentId: string,
    lesson: { courseId: string; weekIndex: number; lessonIndex: number; videoIndex: number }
  ): Promise<IProgress | null> {
    return await ProgressModel.findOneAndUpdate(
      { enrollment: new Types.ObjectId(enrollmentId) },
      {
        $addToSet: {
          completedLessons: {
            courseId: new Types.ObjectId(lesson.courseId),
            weekIndex: lesson.weekIndex,
            lessonIndex: lesson.lessonIndex,
            videoIndex: lesson.videoIndex,
            completedAt: new Date(),
          },
        },
        $set: { lastUpdated: new Date() },
      },
      { new: true, upsert: true }
    );
  }
}
