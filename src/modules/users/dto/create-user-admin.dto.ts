import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, Matches, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserAdminDto {
  @ApiProperty({ example: 'abdo_Atef' })
  @IsString()
  @Matches(/^[a-zA-Z0-9_\.\-]{3,20}$/, { message: 'username must be 3-20 chars, alphanumeric with _.-' })
  username: string;

  @ApiPropertyOptional({ example: 'Abdo' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiProperty({ example: 'abdo@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: '+201009972926' })
  @IsPhoneNumber(undefined, { message: 'phone must be a valid phone number (E.164)' })
  @IsOptional()
  phone?: string;

  @ApiProperty({ minLength: 6, example: 'P@SSword@' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({ example: 'Frontend Web Developer | Angular Enthusiast' })
  @IsString()
  @IsOptional()
  headline?: string;
}
