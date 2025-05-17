// auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  ConflictException,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { TokenService } from '../token/token.service';
import { RefreshTokenDto } from '../auth/dto/refreshToken.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.authService.validateUser(username, password);
    return this.authService.login(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const { emailExists, usernameExists } =
      await this.authService.existingUser(registerDto);
    if (emailExists || usernameExists) {
      throw new ConflictException({
        message: 'User already exists',
        emailExists,
        usernameExists,
      });
    }

    return this.authService.register(registerDto);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const user = await this.usersService.findByVerificationToken(token);
    if (
      !user ||
      !user.emailVerificationTokenExpires ||
      user.emailVerificationTokenExpires < new Date()
    ) {
      throw new BadRequestException('Invalid or expired token');
    }

    user.isEmailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationTokenExpires = null;
    await this.usersService.save(user);

    return { message: 'Email verified successfully' };
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    return await this.authService.refreshToken(refreshTokenDto.refreshToken);
  }
}
