import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { LocalGuard } from '../../guards/local.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import type { Request, Response } from 'express';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  private setRefreshCookie(res: Response, token: string) {
    const isProd = process.env.NODE_ENV === 'production';
    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? 'lax' : 'lax',
      path: '/auth',
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.auth.register({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      image: undefined,
      nickname: dto.fullName ?? undefined,
    });
    this.setRefreshCookie(res, result.refresh_token);
    const { refresh_token, ...rest } = result;
    return rest;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req.user as any; // from Local strategy
    const result = await this.auth.login({ id: user.id, username: user.username });
    this.setRefreshCookie(res, result.refresh_token);
    const { refresh_token, ...rest } = result;
    return rest;
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  async profile(@Req() req: Request) {
    const payload = req.user as any; // from Jwt strategy
    return this.auth.getProfile(payload.sub);
  }

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = (req as any).cookies?.['refresh_token'];
    const result = await this.auth.refreshByToken(rt);
    this.setRefreshCookie(res, result.refresh_token);
    const { refresh_token, ...rest } = result;
    return rest;
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const rt = (req as any).cookies?.['refresh_token'];
    await this.auth.logoutByToken(rt);
    res.clearCookie('refresh_token', { path: '/auth' });
    return { success: true };
  }
}
