import { IsString, IsEnum, IsDateString, Length, IsOptional } from 'class-validator';

export class CreateChildDTO {
  @IsString()
  public firstname!: string;

  @IsString()
  public lastname!: string;

  @IsString()
  @Length(3, 20)
  public username!: string;

  @IsString()
  @Length(6, 6, { message: 'PIN must be exactly 6 digits' })
  public pin!: string;

  @IsEnum(['male', 'female'])
  public gender!: 'male' | 'female';

  @IsDateString()
  public birthdate!: string;
}

export class UpdateChildDTO {
  @IsOptional() @IsString() public firstname?: string;
  @IsOptional() @IsString() public lastname?: string;
  @IsOptional() @IsString() @Length(6, 6, { message: 'PIN must be exactly 6 digits' }) public pin?: string;
  @IsOptional() @IsEnum(['active', 'suspended']) public status?: 'active' | 'suspended';
}
