import { IsNumber, IsString, IsNotEmpty } from 'class-validator';

export class CompleteLessonDTO {
  @IsString()
  @IsNotEmpty()
  public enrollmentId!: string;

  @IsString()
  @IsNotEmpty()
  public courseId!: string;

  @IsNumber()
  public weekIndex!: number;

  @IsNumber()
  public lessonIndex!: number;

  @IsNumber()
  public videoIndex!: number;
}
