import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { IHashService, HASH_SERVICE } from '../../../domain/services/hash.service.interface';
import { ITokenService, TOKEN_SERVICE } from '../../../domain/services/token.service.interface';
import { ILoggerService, LOGGER_SERVICE } from '../../../domain/services/logger.service.interface';

export interface LoginCommand {
  username: string;
  password: string;
}

export interface LoginResult {
  user: {
    id: number;
    username: string;
    roles: string[];
  };
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
    @Inject(LOGGER_SERVICE)
    private readonly logger: ILoggerService,
  ) {}

  async execute(command: LoginCommand): Promise<LoginResult> {
    this.logger.info('Login attempt started', { username: command.username });

    try {
      // Find user
      const user = await this.userRepository.findByUsername(command.username);
      if (!user) {
        this.logger.warn('Login failed: User not found', { username: command.username });
        throw new Error('Invalid credentials');
      }

      if (!user.isEmailVerified) {
        this.logger.warn('Login failed: Email not verified', { 
          username: command.username, 
          userId: user.id 
        });
        throw new Error('Please verify your email first');
      }

      // Verify password
      const isPasswordValid = await this.hashService.compare(command.password, user.password);
      if (!isPasswordValid) {
        this.logger.warn('Login failed: Invalid password', { 
          username: command.username, 
          userId: user.id 
        });
        throw new Error('Invalid credentials');
      }

      // Generate tokens
      const accessToken = await this.tokenService.generateAccessToken({
        sub: user.id,
        username: user.username,
        roles: user.roles,
      });

      const refreshToken = await this.tokenService.generateRefreshToken(user.id);

      // Update user with refresh token (hashed)
      const hashedRefreshToken = await this.hashService.hash(refreshToken);
      const updatedUser = user.updateRefreshToken(hashedRefreshToken);
      await this.userRepository.save(updatedUser);

      this.logger.info('Login successful', { 
        username: command.username, 
        userId: user.id,
        roles: user.roles 
      });

      return {
        user: {
          id: user.id,
          username: user.username,
          roles: user.roles,
        },
        accessToken,
        refreshToken,
      };
    } catch (error) {
      this.logger.error('Login use case error', error as Error, { 
        username: command.username 
      });
      throw error;
    }
  }
}