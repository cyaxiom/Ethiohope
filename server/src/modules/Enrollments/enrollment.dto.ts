import {
  IsBoolean,
  IsDateString,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  IsIn,
  Matches,
} from 'class-validator';

export class CreateEnrollmentDTO {
  /** SELF = adult applies for themselves; CHILD = parent enrolls a child (default). */
  @IsOptional()
  @IsIn(['SELF', 'CHILD'])
  enrolleeType?: 'SELF' | 'CHILD';

  /** Optional on SELF — server uses profile phone if already saved. */
  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-\(\)]{10,20}$/, { message: 'Please enter a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  childIds?: string[];

  // Child Info (used when creating a new child; DOB/age optional)
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
