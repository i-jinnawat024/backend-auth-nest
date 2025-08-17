import { Inject, Injectable } from '@nestjs/common';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';

export interface VerifyEmailCommand {
  token: string;
}

@Injectable()
export class VerifyEmailUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: VerifyEmailCommand): Promise<void> {
    const user = await this.userRepository.findByEmailVerificationToken(command.token);
    
    if (!user) {
      throw new Error('Invalid verification token');
    }

    if (!user.emailVerificationTokenExpires || user.emailVerificationTokenExpires < new Date()) {
      throw new Error('Verification token has expired');
    }

    // Verify email
    const verifiedUser = user.verifyEmail();
    await this.userRepository.save(verifiedUser);
  }
}