import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class Local extends PassportStrategy(Strategy, 'local') {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'userNameOrEmail', passwordField: 'password', session: false });
  }

  async validate(userNameOrEmail: string, password: string) {
    const user = await this.authService.validateUser(userNameOrEmail, password);
    if (!user) throw new UnauthorizedException();
    return user;
  }
}
