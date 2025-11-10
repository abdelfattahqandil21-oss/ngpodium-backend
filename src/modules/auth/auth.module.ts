import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { Jwt } from './strategies/jwt';
import { Local } from './strategies/local';

@Module({
  controllers: [AuthController],
  providers: [AuthService, Jwt, Local]
})
export class AuthModule {}
