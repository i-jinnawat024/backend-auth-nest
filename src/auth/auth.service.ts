import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { MailService } from '../mail/mail.service';
import { RegisterDto } from './dto/register.dto';
import { randomBytes } from 'crypto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private mailService: MailService,
    private tokenService: TokenService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByField('username', username);
    if (!user) {
      throw new UnauthorizedException({message:'ไม่พบผู้ใช้ในระบบ'});
    }
    if (!user.isEmailVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }
    const isMatch = await bcrypt.compare(pass, user!.password);
    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (user) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async validateRefreshToken(userId: number, refreshTokenFromClient: string) {
    const user = await this.usersService.findOneByField('id', userId);
    if (!user || !user.refreshToken) throw new UnauthorizedException();

    const isMatch = await bcrypt.compare(
      refreshTokenFromClient,
      user.refreshToken,
    );
    if (!isMatch) throw new UnauthorizedException();

    return user;
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
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken =
      await this.tokenService.generateAndStoreRefreshToken(user);
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    };
  }

  async logout(userId: number): Promise<void> {
    const user = await this.usersService.findOneByField('id', userId);

    if (!user) {
      throw new BadRequestException('Invalid refresh token');
    }

    await this.tokenService.revokeRefreshToken(user);
  }

  async register(loginDto: any) {
    const user = await this.usersService.create(loginDto);

    const token = randomBytes(32).toString('hex');
    user.emailVerificationToken = token;
    user.emailVerificationTokenExpires = new Date(Date.now() + 1000 * 60 * 60);
    await this.usersService.save(user);

    this.mailService.sendEmailVerification(user.email, token).catch((err) => {
      console.error('Error sending verification email (background):', err);
    });
    return { message: 'Register successfully' };
  }

  async refreshToken(refreshTokenFromClient: string) {
    const user = await this.tokenService.validateRefreshToken(
      refreshTokenFromClient,
    );
    const accessToken = await this.tokenService.generateAccessToken(user);
    const newRefreshToken =
      await this.tokenService.generateAndStoreRefreshToken(user);
    return { accessToken, refreshToken: newRefreshToken };
  }
}
