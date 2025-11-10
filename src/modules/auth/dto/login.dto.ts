import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'ahmed', description: 'Username or email' })
  @IsString()
  @IsNotEmpty()
  userNameOrEmail: string;

  @ApiProperty({ example: 'P@ssw0rd' })
  @IsString()
  @IsNotEmpty()
  password: string;
}
