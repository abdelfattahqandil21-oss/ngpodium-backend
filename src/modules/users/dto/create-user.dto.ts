import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  userName: string;

  @IsString()
  @IsOptional()
  usernickName?: string;

  @IsEmail()
  userEmail: string;

  @IsUrl({ require_protocol: false })
  @IsOptional()
  userImg?: string;

  @IsPhoneNumber('EG', { message: 'userPhone must be a valid phone number' })
  @IsOptional()
  userPhone?: string;
}
