import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
} from 'class-validator';

export class CreateEnrollmentDTO {
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  childIds?: string[];

  // Child Info (Required if childId is not provided)
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsBoolean()
  isUSA?: boolean;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  region?: string;

  // Enrollment Info
  @IsMongoId()
  @IsNotEmpty()
  programId!: string;

  @IsMongoId()
  @IsNotEmpty()
  phaseId!: string;

  @IsMongoId()
  @IsNotEmpty()
  batchId!: string;

  @IsOptional()
  @IsMongoId({ each: true })
  selectedSchedules?: string[];
}
