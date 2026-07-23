import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';

const toBoolean = ({ value }: { value: unknown }) => {
  if (typeof value === 'boolean') return value;
  if (value === 'true' || value === '1' || value === 1) return true;
  if (value === 'false' || value === '0' || value === 0) return false;
  return value;
};

export class CreateProgramDTO {
  @IsString()
  @MinLength(3)
  title!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isForChildren?: boolean;

  @IsOptional()
  @IsIn(['STANDARD', 'ACADEMIC_TUTORIAL'])
  programType?: 'STANDARD' | 'ACADEMIC_TUTORIAL';

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}

export class UpdateProgramDTO {
  @IsOptional()
  @IsString()
  @MinLength(3)
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  ageRange?: string;

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isForChildren?: boolean;

  @IsOptional()
  @IsIn(['STANDARD', 'ACADEMIC_TUTORIAL'])
  programType?: 'STANDARD' | 'ACADEMIC_TUTORIAL';

  @IsOptional()
  @Transform(toBoolean)
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  orderIndex?: number;
}
