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
import { LoginUseCase } from '../application/use-cases/auth/login.use-case';
import { RegisterUseCase } from '../application/use-cases/auth/register.use-case';
import { LogoutUseCase } from '../application/use-cases/auth/logout.use-case';
import { RefreshTokenUseCase } from '../application/use-cases/auth/refresh-token.use-case';
import { VerifyEmailUseCase } from '../application/use-cases/auth/verify-email.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly refreshTokenUseCase: RefreshTokenUseCase,
    private readonly verifyEmailUseCase: VerifyEmailUseCase,
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
    try {
      await this.registerUseCase.execute({
        username: registerDto.username,
        email: registerDto.email,
        password: registerDto.password,
      });
      return { message: 'Registration successful. Please check your email for verification.' };
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
      return { message: 'Email verified successfully' };
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
      return { message: 'Logged out successfully' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}