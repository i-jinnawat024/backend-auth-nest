import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { IHashService, HASH_SERVICE } from '../../../domain/services/hash.service.interface';
import { ITokenService, TOKEN_SERVICE } from '../../../domain/services/token.service.interface';

export interface RefreshTokenCommand {
  refreshToken: string;
}

export interface RefreshTokenResult {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(TOKEN_SERVICE)
    private readonly tokenService: ITokenService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResult> {
    // Verify refresh token
    const payload = await this.tokenService.verifyRefreshToken(command.refreshToken);
    
    // Find user
    const user = await this.userRepository.findById(payload.sub);
    if (!user || !user.refreshToken) {
      throw new Error('Invalid refresh token');
    }

    // Verify stored refresh token
    const isRefreshTokenValid = await this.hashService.compare(
      command.refreshToken,
      user.refreshToken,
    );
    if (!isRefreshTokenValid) {
      throw new Error('Invalid refresh token');
    }

    // Generate new tokens
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      username: user.username,
      roles: user.roles,
    });

    const newRefreshToken = await this.tokenService.generateRefreshToken(user.id);

    // Update user with new refresh token (hashed)
    const hashedRefreshToken = await this.hashService.hash(newRefreshToken);
    const updatedUser = user.updateRefreshToken(hashedRefreshToken);
    await this.userRepository.save(updatedUser);

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }
}