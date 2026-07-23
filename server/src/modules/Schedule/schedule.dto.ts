import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateScheduleDTO {
  /** Optional in body — server sets/validates from the batch's program. Prefer sending it from the admin UI. */
  @IsOptional()
  @IsMongoId()
  program?: string;

  @IsMongoId()
  @IsNotEmpty()
  batch!: string;

  @IsString()
  @IsNotEmpty()
  sessionLabel!: string;

  @IsEnum(['LECTURE', 'DISCUSSION'])
  @IsNotEmpty()
  type!: 'LECTURE' | 'DISCUSSION';

  @IsEnum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ])
  @IsNotEmpty()
  dayOfWeek!:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime!: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity?: number;
}

export class UpdateScheduleDTO {
  @IsOptional()
  @IsMongoId()
  program?: string;

  @IsOptional()
  @IsMongoId()
  batch?: string;

  @IsOptional()
  @IsString()
  sessionLabel?: string;

  @IsOptional()
  @IsEnum(['LECTURE', 'DISCUSSION'])
  type?: 'LECTURE' | 'DISCUSSION';

  @IsOptional()
  @IsEnum([
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
    'SUNDAY',
  ])
  dayOfWeek?:
    | 'MONDAY'
    | 'TUESDAY'
    | 'WEDNESDAY'
    | 'THURSDAY'
    | 'FRIDAY'
    | 'SATURDAY'
    | 'SUNDAY';

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'startTime must be in HH:mm format',
  })
  startTime?: string;

  @IsOptional()
  @IsString()
  @Matches(/^([01]\d|2[0-3]):?([0-5]\d)$/, {
    message: 'endTime must be in HH:mm format',
  })
  endTime?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity?: number;
}
