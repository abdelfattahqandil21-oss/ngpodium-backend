import { Body, Controller, Get, HttpCode, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from '../../services/auth/auth.service';
import { LocalGuard } from '../../guards/local.guard';
import { JwtGuard } from '../../guards/jwt.guard';
import type { Request, Response } from 'express';
import { RegisterDto } from '../../dto/register.dto';
import { LoginDto } from '../../dto/login.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { RefreshDto } from '../../dto/refresh.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}


  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    const result = await this.auth.register({
      username: dto.username,
      email: dto.email,
      password: dto.password,
      phone: dto.phone,
      image: undefined,
      nickname: dto.fullName ?? undefined,
    });
    return result;
  }

  @Post('login')
  @UseGuards(LocalGuard)
  @ApiBody({ type: LoginDto })
  async login(@Req() req: Request) {
    const user = req.user as any; // from Local strategy
    const result = await this.auth.login({ id: user.id, username: user.username });
    return result;
  }

  @Get('profile')
  @UseGuards(JwtGuard)
  @ApiBearerAuth('JWT')
  async profile(@Req() req: Request) {
    const payload = req.user as any; // from Jwt strategy
    return this.auth.getProfile(payload.sub);
  }

  @Post('refresh')
  @HttpCode(200)
  @ApiBody({ type: RefreshDto })
  @ApiBearerAuth('JWT')
  async refresh(@Body() dto: RefreshDto, @Req() req: Request) {
    // Extract access token from Authorization header (optional for Proof of Possession)
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    const result = await this.auth.refreshByToken(dto.token, accessToken);
    return result;
  }

  @Post('logout')
  @ApiBody({ type: RefreshDto })
  async logout(@Body() dto: RefreshDto) {
    await this.auth.logoutByToken(dto.token);
    return { success: true };
  }
}
