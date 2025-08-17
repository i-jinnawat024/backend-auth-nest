import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ITokenService, TokenPayload } from '../../domain/services/token.service.interface';

@Injectable()
export class JwtTokenService implements ITokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateAccessToken(payload: TokenPayload): Promise<string> {
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async generateRefreshToken(userId: number): Promise<string> {
    return this.jwtService.sign(
      { sub: userId },
      {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
  }

  async verifyAccessToken(token: string): Promise<TokenPayload> {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async verifyRefreshToken(token: string): Promise<{ sub: number }> {
    return this.jwtService.verify(token, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });
  }
}