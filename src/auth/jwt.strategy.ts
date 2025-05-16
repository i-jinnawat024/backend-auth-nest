// auth/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'BiziWNS50Y6ft0Oc2D34A+SYo7E4vCRM8tbcw5KPHSIplL2++mYUbVjdYVLZCrQvw/lmxwVFJPxAkeCYSCszmw==',
    });
  }

  async validate(payload: any,done: Function) {
    
    return { userId: payload.sub, username: payload.username,roles:payload.roles };
  }
}

