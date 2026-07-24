import { IsString, IsBoolean, IsArray, IsOptional, ValidateNested, IsNumber, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class QuestionDTO {
  @IsString()
  public question!: string;

  @IsArray()
  @IsString({ each: true })
  public options!: string[];

  @IsNumber()
  @Type(() => Number)
  public correctAnswer!: number;
}

export class ExerciseDTO {
  @IsString()
  public title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDTO)
  public questions!: QuestionDTO[];
}

export class LessonVideoDTO {
  @IsString()
  public url!: string;

  @IsOptional()
  @IsString()
  public subtitle?: string;

  @IsOptional()
  @IsString()
  public description?: string;
}

export class LessonContentDTO {
  @IsString()
  public title!: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonVideoDTO)
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((video) => (typeof video === "string" ? { url: video } : video))
      : []
  )
  public videoUrls!: LessonVideoDTO[];

  @IsOptional()
  @IsString()
  public pdfUrl?: string;
}

export class WeekDTO {
  @IsString()
  public title!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LessonContentDTO)
  public lessons!: LessonContentDTO[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExerciseDTO)
  public exercises!: ExerciseDTO[];
}

export class CreateCourseDTO {
  @IsString()
  public title!: string;

  @IsString()
  public description!: string;

  @IsString()
  public thumbnail!: string;

  @IsMongoId()
  public program!: string;

  @IsMongoId()
  public phase!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekDTO)
  public weeks!: WeekDTO[];

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}

export class UpdateCourseDTO {
  @IsOptional()
  @IsString()
  public title?: string;

  @IsOptional()
  @IsString()
  public description?: string;

  @IsOptional()
  @IsString()
  public thumbnail?: string;

  @IsOptional()
  @IsMongoId()
  public program?: string;

  @IsOptional()
  @IsMongoId()
  public phase?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WeekDTO)
  public weeks?: WeekDTO[];

  @IsOptional()
  @IsBoolean()
  public isActive?: boolean;
}
