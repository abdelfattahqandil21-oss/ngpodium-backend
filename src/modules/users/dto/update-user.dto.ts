import { IsEmail, IsOptional, IsPhoneNumber, IsString, IsUrl, Matches } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @Matches(/^[a-zA-Z0-9_\.\-]{3,20}$/, { message: 'username must be 3-20 chars, alphanumeric with _.-' })
  username?: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsUrl({ require_protocol: false })
  @IsOptional()
  image?: string;

  @IsPhoneNumber(undefined, { message: 'phone must be a valid phone number (E.164)' })
  @IsOptional()
  phone?: string;
}
