import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TokenService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateAccessToken(user: any) {
    const payload = {
      sub: user.id,
      username: user.username,
      roles: user.roles,
    };
    return this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
      secret: this.configService.get<string>('JWT_SECRET'),
    });
  }

  async generateAndStoreRefreshToken(user: any) {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      {
        expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      },
    );
    await this.usersService.updateRefreshToken(user, refreshToken);
    return refreshToken;
  }

  async validateRefreshToken(refreshTokenFromClient: string) {
    const payload = this.jwtService.verify(refreshTokenFromClient, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
    });

    const user = await this.usersService.findOneByField('id', payload.sub);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(
      refreshTokenFromClient,
      user.refreshToken,
    );
    
    if (!isMatch) throw new UnauthorizedException();
    return user;
  }

  //   async revokeRefreshToken(userId: number) {
  //     await this.usersService.removeRefreshToken(userId);
  //   }
}
