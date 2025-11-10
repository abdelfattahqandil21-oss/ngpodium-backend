import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../../common/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';

interface RegisterDto {
  fullName?: string;
  username: string;
  email: string;
  phone?: string;
  password: string;
  image?: string | null;
  nickname?: string | null;
}

interface LoginDto {
  identifier: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  private safeUserSelect() {
    return {
      id: true,
      username: true,
      email: true,
      image: true,
      nickname: true,
      phone: true,
      createdAt: true,
      updatedAt: true,
    } as const;
  }

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findFirst({
      where: { OR: [{ username: dto.username }, { email: dto.email }] },
      select: { id: true },
    });
    if (exists) throw new ConflictException('Username or email already exists');

    const hash = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        email: dto.email,
        password: hash,
        image: dto.image ?? null,
        nickname: dto.nickname ?? null,
        phone: dto.phone ?? null,
      },
      select: this.safeUserSelect(),
    });
    const tokens = await this.issueAccessAndRefresh(user.id, user.username);
    return { ...tokens, user };
  }

  async validateUser(identifier: string, password: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [{ username: identifier }, { email: identifier }],
      },
      select: { id: true, username: true, email: true, image: true, nickname: true, phone: true, password: true, createdAt: true, updatedAt: true },
    });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new UnauthorizedException('Invalid credentials');
    const { password: _p, ...safe } = user as any;
    return safe;
  }

  async login(user: { id: number; username: string }) {
    const tokens = await this.issueAccessAndRefresh(user.id, user.username);
    const profile = await this.prisma.user.findUnique({ where: { id: user.id }, select: this.safeUserSelect() });
    return { ...tokens, user: profile };
  }

  async getProfile(userId: number) {
    const profile = await this.prisma.user.findUnique({ where: { id: userId }, select: this.safeUserSelect() });
    if (!profile) throw new UnauthorizedException();
    return profile;
  }

  async refreshTokens(userId: number, currentRt: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { id: true, username: true, refreshTokenHash: true } as any });
    if (!user || !user.refreshTokenHash) throw new UnauthorizedException();
    const valid = await bcrypt.compare(currentRt as unknown as string, user.refreshTokenHash as unknown as string);
    if (!valid) throw new UnauthorizedException();
    return this.issueAccessAndRefresh(Number((user as any).id), String((user as any).username));
  }

  async refreshByToken(rt: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number; username: string }>(rt, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') || this.config.get<string>('JWT_SECRET'),
      });
      return this.refreshTokens(payload.sub, rt);
    } catch {
      throw new UnauthorizedException();
    }
  }

  async logout(userId: number) {
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: null } as any });
    return { success: true };
  }

  async logoutByToken(rt: string) {
    try {
      const payload = await this.jwt.verifyAsync<{ sub: number }>(rt, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET') || this.config.get<string>('JWT_SECRET'),
      });
      return this.logout(payload.sub);
    } catch {
      throw new UnauthorizedException();
    }
  }

  private async issueAccessAndRefresh(userId: number, username: string) {
    const accessExpiresIn = this.config.get<string>('JWT_EXPIRES_IN') || '30m';
    const refreshExpiresIn = this.config.get<string>('JWT_REFRESH_EXPIRES_IN') || '30d';
    const refreshSecret = this.config.get<string>('JWT_REFRESH_SECRET') || this.config.get<string>('JWT_SECRET');

    const payload = { sub: userId, username };
    const access_token = await this.jwt.signAsync(payload, {
      secret: this.config.get<string>('JWT_SECRET')!,
      expiresIn: this.parseExpirySeconds(accessExpiresIn),
    });

    const refresh_token = await this.jwt.signAsync(payload, {
      secret: refreshSecret!,
      expiresIn: this.parseExpirySeconds(refreshExpiresIn),
    });

    const hash = await bcrypt.hash(refresh_token, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { refreshTokenHash: hash } as any });

    const now = Date.now();
    const expiresInSec = this.parseExpirySeconds(accessExpiresIn);
    const expiresAt = now + expiresInSec * 1000;

    return { access_token, refresh_token, expiresIn: expiresInSec, expiresAt };
  }

  private parseExpirySeconds(exp: string | number): number {
    if (typeof exp === 'number') return exp;
    const m = /^([0-9]+)([smhd])?$/.exec(exp);
    if (!m) return 1800;
    const n = parseInt(m[1], 10);
    const unit = m[2] || 's';
    switch (unit) {
      case 's': return n;
      case 'm': return n * 60;
      case 'h': return n * 3600;
      case 'd': return n * 86400;
      default: return n;
    }
  }
}
