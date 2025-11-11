import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, type StrategyOptionsWithRequest } from 'passport-jwt';
import type { Request } from 'express';
import { ConfigService } from '@nestjs/config';

function tokenExtractor(req: Request): string | null {
  // 1) Cookie
  const cookieToken = (req as any).cookies?.['refresh_token'];
  if (cookieToken) {
    (req as any).refreshToken = cookieToken;
    return cookieToken;
  }
  // 2) Header: x-refresh-token
  const headerToken = req.header('x-refresh-token');
  if (headerToken) {
    (req as any).refreshToken = headerToken;
    return headerToken;
  }
  // 3) Body: token or refresh_token
  const bodyToken = (req as any).body?.token || (req as any).body?.refresh_token;
  if (bodyToken) {
    (req as any).refreshToken = bodyToken;
    return bodyToken;
  }
  // 4) As a fallback, Authorization: Bearer <rt>
  const bearer = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
  if (bearer) {
    (req as any).refreshToken = bearer;
    return bearer;
  }
  return null;
}

@Injectable()
export class JwtRefresh extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(private readonly config: ConfigService) {
    super({
      jwtFromRequest: tokenExtractor,
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_REFRESH_SECRET') || config.get<string>('JWT_SECRET'),
      passReqToCallback: true,
    } as StrategyOptionsWithRequest);
  }

  async validate(req: Request, payload: any) {
    // Attach raw refresh token on request for controller/service use
    (req as any).refreshToken = (req as any).refreshToken || null;
    return payload; // { sub, username, iat, exp }
  }
}
