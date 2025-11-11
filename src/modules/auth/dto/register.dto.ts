import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

enum Role {
  user = 'user',
  admin = 'admin',
  superAdmin = 'superAdmin',
}

export class RegisterDto {
  @ApiProperty({ example: 'Abdo Atef', description: 'Full name to show as default nickname if not provided' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ example: 'abdo', description: 'Unique username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'abdo@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '+201009972926' })
  @IsPhoneNumber('EG', { message: 'phone must be a valid phone number' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ enum: Role, example: 'user' })
  @IsEnum(Role)
  @IsOptional()
  role: Role = Role.user;

  @ApiPropertyOptional({ example: 'Computer Science' })
  @IsString()
  @IsOptional()
  major?: string;
}
