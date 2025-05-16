// auth/auth.controller.ts
import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';


@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }
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
}
