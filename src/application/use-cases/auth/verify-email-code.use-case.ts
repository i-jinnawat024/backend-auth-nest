import { Inject, Injectable } from '@nestjs/common';
import { IEmailVerificationCodeRepository, EMAIL_VERIFICATION_CODE_REPOSITORY } from '../../../domain/repositories/email-verification-code.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { Email } from '../../../domain/value-objects/email.vo';

export interface VerifyEmailCodeCommand {
  email: string;
  code: string;
}

@Injectable()
export class VerifyEmailCodeUseCase {
  constructor(
    @Inject(EMAIL_VERIFICATION_CODE_REPOSITORY)
    private readonly emailVerificationCodeRepository: IEmailVerificationCodeRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(command: VerifyEmailCodeCommand): Promise<void> {
    const email = new Email(command.email);

    // ค้นหารหัสยืนยัน
    const verificationCode = await this.emailVerificationCodeRepository.findByEmailAndCode(
      email.value,
      command.code,
    );

    if (!verificationCode) {
      throw new Error('รหัสยืนยันไม่ถูกต้อง');
    }

    // ตรวจสอบว่ารหัสยังใช้ได้หรือไม่
    if (!verificationCode.isValid()) {
      throw new Error('รหัสยืนยันหมดอายุหรือถูกใช้งานแล้ว');
    }

    // ค้นหาผู้ใช้งาน
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new Error('ไม่พบผู้ใช้งาน');
    }

    // ยืนยันอีเมล
    const verifiedUser = user.verifyEmail();
    await this.userRepository.save(verifiedUser);

    // ทำเครื่องหมายรหัสยืนยันว่าใช้งานแล้ว
    const usedCode = verificationCode.markAsUsed();
    await this.emailVerificationCodeRepository.save(usedCode);
  }
}