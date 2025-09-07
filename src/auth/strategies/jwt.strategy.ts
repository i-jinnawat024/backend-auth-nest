import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
<<<<<<< Updated upstream
      secretOrKey:configService.get<string>('JWT_SECRET'),
=======
      secretOrKey: configService.get<string>('JWT_SECRET'),
      ignoreExpiration: false,
>>>>>>> Stashed changes
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, roles: payload.roles };
  }
}
