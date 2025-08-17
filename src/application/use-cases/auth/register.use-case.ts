import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../domain/entities/user.entity';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { IHashService, HASH_SERVICE } from '../../../domain/services/hash.service.interface';
import { IMailService, MAIL_SERVICE } from '../../../domain/services/mail.service.interface';
import { Email } from '../../../domain/value-objects/email.vo';
import { Password } from '../../../domain/value-objects/password.vo';
import { randomBytes } from 'crypto';

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

    // Create user
    const user = User.create({
      username: command.username,
      email: email.value,
      password: hashedPassword,
    });

    // Generate email verification token
    const verificationToken = randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    const userWithToken = user.setEmailVerificationToken(verificationToken, tokenExpiry);

    // Save user
    const savedUser = await this.userRepository.save(userWithToken);

    // Send verification email
    await this.mailService.sendEmailVerification(email.value, verificationToken);
  }
}