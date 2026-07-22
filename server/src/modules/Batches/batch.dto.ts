import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchDTO {
  @IsMongoId()
  @IsNotEmpty()
  program!: string;

  @IsOptional()
  @IsMongoId()
  instructor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsNotEmpty()
  @IsString()
  batchName!: string;

  @IsOptional()
  isActive?: boolean;
}

export class UpdateBatchDTO {
  @IsOptional()
  @IsMongoId()
  program?: string;

  @IsOptional()
  @IsString()
  instructor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  capacity?: number;

  @IsOptional()
  @IsString()
  batchName?: string;

  @IsOptional()
  isActive?: boolean;
}
