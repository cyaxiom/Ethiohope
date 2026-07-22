import { IsString, IsNotEmpty, IsOptional, IsDateString, IsMongoId } from 'class-validator';

export class CreateSessionDTO {
  @IsMongoId()
  @IsNotEmpty()
  public programId!: string;

  @IsMongoId()
  @IsNotEmpty()
  public phaseId!: string;

  @IsMongoId()
  @IsNotEmpty()
  public batchId!: string;

  @IsOptional()
  @IsMongoId()
  public scheduleId?: string;

  @IsString()
  @IsNotEmpty()
  public sessionType!: string;

  @IsString()
  @IsNotEmpty()
  public title!: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDateString()
  @IsNotEmpty()
  public startTime!: string;

  @IsDateString()
  @IsNotEmpty()
  public endTime!: string;
}

export class UpdateSessionDTO {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDateString()
  @IsOptional()
  public startTime?: string;

  @IsDateString()
  @IsOptional()
  public endTime?: string;

  @IsString()
  @IsOptional()
  public targetDate?: string;

  @IsMongoId()
  @IsOptional()
  public scheduleId?: string;
}

export class CreateSessionFromScheduleDTO {
  @IsOptional()
  @IsMongoId()
  public programId?: string;

  @IsOptional()
  @IsMongoId()
  public phaseId?: string;

  @IsString()
  @IsNotEmpty()
  public targetDate!: string; // Expected "YYYY-MM-DD"
}
