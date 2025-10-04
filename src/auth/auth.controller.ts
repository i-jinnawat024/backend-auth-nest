import {
  Body,
  Controller,
  Post,
  HttpCode,
  HttpStatus,
  ConflictException,
  Get,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshTokenDto } from '../auth/dto/refreshToken.dto';
import { LogoutDto } from './dto/logout.dto';
import { VerifyEmailCodeDto } from './dto/verify-email-code.dto';
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../application/use-cases/auth/register.use-case';
import { LogoutUseCase } from '../application/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case';
import { SendEmailVerificationCodeUseCase } from '../application/use-cases/auth/send-email-verification-code.use-case';
import { VerifyEmailCodeUseCase } from '../application/use-cases/auth/verify-email-code.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
    private readonly sendEmailVerificationCodeUseCase: SendEmailVerificationCodeUseCase,
    private readonly verifyEmailCodeUseCase: VerifyEmailCodeUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.loginUseCase.execute({
        username: loginDto.username,
        password: loginDto.password,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() registerDto: RegisterDto) {
    const { username, email, password } = registerDto;
    try {
      await this.registerUseCase.execute({
        username,
        email,
        password,
      });
      return 'Registration successful. Please check your email for verification.';
    } catch (error) {
      if (error.message.includes('already exists')) {
        throw new ConflictException(error.message);
      }
      throw new BadRequestException(error.message);
    }
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    try {
      await this.verifyEmailUseCase.execute({ token });
      return 'Email verified successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('refresh')
  async refreshToken(@Body() refreshTokenDto: RefreshTokenDto) {
    try {
      return await this.refreshTokenUseCase.execute({
        refreshToken: refreshTokenDto.refreshToken,
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() logoutDto: LogoutDto) {
    try {
      await this.logoutUseCase.execute({ userId: logoutDto.id });
      return 'Logged out successfully';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('send-verification-code')
  @HttpCode(HttpStatus.OK)
  async sendVerificationCode(@Body('email') email: string) {
    try {
      await this.sendEmailVerificationCodeUseCase.execute({ email });
      return 'รหัสยืนยันถูกส่งไปยังอีเมลของคุณแล้ว';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('verify-email-code')
  @HttpCode(HttpStatus.OK)
  async verifyEmailCode(@Body() verifyEmailCodeDto: VerifyEmailCodeDto) {
    try {
      await this.verifyEmailCodeUseCase.execute({
        email: verifyEmailCodeDto.email,
        code: verifyEmailCodeDto.code,
      });
      return 'อีเมลได้รับการยืนยันเรียบร้อยแล้ว';
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
