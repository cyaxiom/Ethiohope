import {
  IsBoolean,
  IsIn,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreatePackageDTO {
  @IsMongoId()
  @IsNotEmpty()
  program!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsNumber()
  @Min(0)
  price!: number;

  @IsNumber()
  @Min(1)
  @Max(5)
  daysPerWeek!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsString()
  stripePriceId?: string;
}

export class UpdatePackageDTO {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  daysPerWeek?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isPopular?: boolean;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsString()
  stripePriceId?: string;
}

export const PACKAGE_DAYS_LABELS: Record<number, string> = {
  1: 'Once a week',
  2: 'Twice a week',
  3: '3 times a week',
  4: '4 times a week',
  5: '5 times a week',
};
