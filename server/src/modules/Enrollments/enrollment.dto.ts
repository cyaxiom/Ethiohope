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
  ValidateNested,
  ArrayMinSize,
  ValidateIf,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ACADEMIC_SUBJECTS, DAYS_OF_WEEK, SUBJECT_PRIORITIES } from '@modules/Package/academicSubjects';

export class EnrollmentSubjectDTO {
  @IsString()
  @IsIn([...ACADEMIC_SUBJECTS])
  name!: string;

  @IsIn([...SUBJECT_PRIORITIES])
  priority!: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class EnrollmentTimeBlockDTO {
  @IsString()
  @IsIn([...DAYS_OF_WEEK])
  dayOfWeek!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'startTime must be HH:mm' })
  startTime!: string;

  @IsString()
  @Matches(/^\d{2}:\d{2}$/, { message: 'endTime must be HH:mm' })
  endTime!: string;

  @IsString()
  @IsIn([...ACADEMIC_SUBJECTS])
  subject!: string;
}

export class CreateEnrollmentDTO {
  @IsOptional()
  @IsIn(['SELF', 'CHILD'])
  enrolleeType?: 'SELF' | 'CHILD';

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-\(\)]{10,20}$/, { message: 'Please enter a valid phone number' })
  phone?: string;

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  childIds?: string[];

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

  @IsOptional()
  @IsString()
  notes?: string;

  @IsMongoId()
  @IsNotEmpty()
  programId!: string;

  /** Standard program path */
  @ValidateIf((o) => !o.packageId)
  @IsMongoId()
  @IsNotEmpty()
  phaseId?: string;

  @ValidateIf((o) => !o.packageId)
  @IsMongoId()
  @IsNotEmpty()
  batchId?: string;

  @IsOptional()
  @IsMongoId({ each: true })
  selectedSchedules?: string[];

  /** Academic tutorial path */
  @ValidateIf((o) => !o.phaseId)
  @IsMongoId()
  @IsNotEmpty()
  packageId?: string;

  @ValidateIf((o) => !!o.packageId)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EnrollmentSubjectDTO)
  subjects?: EnrollmentSubjectDTO[];

  @ValidateIf((o) => !!o.packageId)
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => EnrollmentTimeBlockDTO)
  timeBlocks?: EnrollmentTimeBlockDTO[];
}
