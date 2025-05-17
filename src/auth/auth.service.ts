// auth/auth.service.ts
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByField('username', username);
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
  async existingUser(registerDto: RegisterDto): Promise<{
    emailExists: boolean;
    usernameExists: boolean;
  }> {
    const [userByEmail, userByUsername] = await Promise.all([
      this.usersService.findOneByField('email', registerDto.email),
      this.usersService.findOneByField('username', registerDto.username),
    ]);

    return {
      emailExists: !!userByEmail,
      usernameExists: !!userByUsername,
    };
  }

  async login(user: any) {
    user.lastLogin = new Date();
    await this.usersService.save(user);
    const payload = {
      username: user.username,
      sub: user.id,
      roles: user.roles,
    };
    const token = this.jwtService.sign(payload);
    return {
      access_token: token,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async register(loginDto: any) {
    const user = await this.usersService.create(loginDto);

    const token = randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    await this.usersService.save(user);

    await this.mailService.sendEmailVerification(user.email, token);
    return this.login(user);
  }
}
