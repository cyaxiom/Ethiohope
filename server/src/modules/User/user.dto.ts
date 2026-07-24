import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

import { IUser } from '@modules/User/user.interface';
import { Types } from 'mongoose';

export class UserDTO implements IUser {
  @IsOptional()
  _id!: Types.ObjectId;

  @IsString()
  firstname!: string;

  @IsString()
  lastname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password!: string;

  @IsOptional()
  roles!: Types.ObjectId[];

  @IsOptional()
  roleCodes?: string[];

  @IsOptional()
  lastLogin!: Date;

  @IsEnum(['active', 'suspended', 'blocked'])
  status!: 'active' | 'suspended' | 'blocked';

  @IsBoolean()
  @IsOptional()
  public isOnline!: boolean;

  @IsOptional()
  public createdAt!: Date;

  @IsDate()
  @IsOptional()
  public updatedAt!: Date;

  @IsBoolean()
  @IsOptional()
  public isEmailVerified!: boolean;

  // Optional Parent Fields
  @IsOptional()
  @IsEnum(['mother', 'father', 'guardian', 'other'])
  parentType?: 'mother' | 'father' | 'guardian' | 'other';

  @IsOptional()
  @IsString()
  phone?: string;

  @IsBoolean()
  @IsOptional()
  phoneVerified!: boolean;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsBoolean()
  isProfileComplete?: boolean;
}

export class UserLoginDTO {
  @IsString()
  @MinLength(3)
  identifier!: string; // email OR username

  @IsString()
  @MinLength(4)
  password!: string;
}

export class CompleteProfileDTO {
  @IsEnum(['mother', 'father', 'guardian', 'other'])
  parentType!: 'mother' | 'father' | 'guardian' | 'other';

  @IsString()
  @Matches(/^\+?[\d\s\-\(\)]{10,20}$/, { message: 'Please enter a valid phone number' })
  phone!: string;

  @IsString()
  @MinLength(2, { message: 'Country name is too short' })
  @Matches(/[a-zA-Z]/, { message: 'Country must contain letters and not just numbers' })
  country!: string;

  @IsString()
  @MinLength(2, { message: 'State name is too short' })
  @Matches(/[a-zA-Z]/, { message: 'State must contain letters and not just numbers' })
  state!: string;

  @IsString()
  @MinLength(2, { message: 'City name is too short' })
  @Matches(/[a-zA-Z]/, { message: 'City must contain letters and not just numbers' })
  city!: string;
}

import { IsArray, ArrayNotEmpty } from 'class-validator';

export class CreateUserDTO {
  @IsString()
  firstname!: string;

  @IsString()
  lastname!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles!: string[];
}

export class UpdateUserRolesDTO {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  roles!: string[];
}

export class UpdateUserStatusDTO {
  @IsEnum(['active', 'suspended', 'blocked'])
  status!: 'active' | 'suspended' | 'blocked';
}