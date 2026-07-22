import { NextFunction, Response } from 'express';
import { ProgressService } from './progress.service';
import { RequestWithTokenPayload } from '@modules/Authentication/auth.interface';
import { CompleteLessonDTO } from './progress.dto';
import HttpStatusCodes from '@common/utils/HttpStatusCodes';

export class ProgressController {
  private progressService = new ProgressService();

  public completeLesson = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const { _id, type } = req.tokenPayload;
      const lessonData: CompleteLessonDTO = req.body;

      const progress = await this.progressService.completeLesson(
        _id.toString(),
        type,
        lessonData.enrollmentId,
        lessonData.courseId,
        lessonData.weekIndex,
        lessonData.lessonIndex,
        lessonData.videoIndex
      );

      res.status(HttpStatusCodes.OK).json({ data: progress, message: 'Lecture marked as completed' });
    } catch (error) {
      next(error);
    }
  };

  public getProgress = async (req: RequestWithTokenPayload, res: Response, next: NextFunction) => {
    try {
      const { enrollmentId } = req.params;
      const progress = await this.progressService.getProgress(enrollmentId);

      res.status(HttpStatusCodes.OK).json({ data: progress, message: 'Progress fetched successfully' });
    } catch (error) {
      next(error);
    }
  };
}
