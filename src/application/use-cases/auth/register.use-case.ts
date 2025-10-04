import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { EmailVerificationCode } from '../../../domain/entities/email-verification-code.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { IEmailVerificationCodeRepository, EMAIL_VERIFICATION_CODE_REPOSITORY } from '../../../domain/repositories/email-verification-code.repository.interface';
import { IHashService, HASH_SERVICE } from '../../../domain/services/hash.service.interface';
import { IMailService, MAIL_SERVICE } from '../../../domain/services/mail.service.interface';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';

export interface RegisterCommand {
  username: string;
  email: string;
  password: string;
}

export interface RegisterResult {
  user: User;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(EMAIL_VERIFICATION_CODE_REPOSITORY)
    private readonly emailVerificationCodeRepository: IEmailVerificationCodeRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: IHashService,
    @Inject(MAIL_SERVICE)
    private readonly mailService: IMailService,
  ) {}

  async execute(command: RegisterCommand): Promise<void> {
    const email = new Email(command.email);
    const password = new Password(command.password);

    // Check if user already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email.value);
    if (existingUserByEmail) {
      throw new Error('User with this email already exists');
    }

    const existingUserByUsername = await this.userRepository.findByUsername(command.username);
    if (existingUserByUsername) {
      throw new Error('User with this username already exists');
    }

    // Hash password
    const hashedPassword = await this.hashService.hash(password.value);

    // Create user (without email verification)
    const user = User.create({
      username: command.username,
      email: email.value,
      password: hashedPassword,
    });

    // Save user
    const savedUser = await this.userRepository.save(user);

    // Generate and save email verification code
    const verificationCode = EmailVerificationCode.createWithGeneratedCode(email.value, 10);
    await this.emailVerificationCodeRepository.save(verificationCode);

    // Send verification code email
    await this.mailService.sendEmailVerificationCode(email.value, verificationCode.code);
  }
}

