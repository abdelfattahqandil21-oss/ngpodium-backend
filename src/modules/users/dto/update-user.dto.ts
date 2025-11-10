import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  userName?: string;

  @IsString()
  @IsOptional()
  usernickName?: string;

  @IsEmail()
  @IsOptional()
  userEmail?: string;

  @IsUrl({ require_protocol: false })
  @IsOptional()
  userImg?: string;

  @IsPhoneNumber('EG', { message: 'userPhone must be a valid phone number' })
  @IsOptional()
  userPhone?: string;
}
