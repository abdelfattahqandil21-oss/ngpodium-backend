import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiPropertyOptional({ example: 'abdo_Atef' })
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_\.\-]{3,20}$/, { message: 'username must be 3-20 chars, alphanumeric with _.-' })
  username?: string;

  @ApiPropertyOptional({ example: 'Abdo Atef' })
  @IsString()
  @IsOptional()
  nickname?: string;

  @ApiPropertyOptional({ example: 'abdo@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'https://example.com/avatar.png' })
  @IsUrl({ require_protocol: false })
  @IsOptional()
  image?: string;

  @ApiPropertyOptional({ example: '+201009972926' })
  @IsPhoneNumber(undefined, { message: 'phone must be a valid phone number (E.164)' })
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ example: 'Frontend Web Developer | Angular Enthusiast' })
  @IsString()
  @IsOptional()
  headline?: string;
}
