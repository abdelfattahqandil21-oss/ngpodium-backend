import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

enum Role {
  user = 'user',
  admin = 'admin',
  superAdmin = 'superAdmin',
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsPhoneNumber('EG', { message: 'phone must be a valid phone number' })
  @IsOptional()
  phone?: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.user;

  @IsString()
  @IsOptional()
  major?: string;
}
