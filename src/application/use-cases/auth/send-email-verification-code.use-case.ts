import { Inject, Injectable } from '@nestjs/common';
import { EmailVerificationCode } from '../../../domain/entities/email-verification-code.entity';
import { IEmailVerificationCodeRepository, EMAIL_VERIFICATION_CODE_REPOSITORY } from '../../../domain/repositories/email-verification-code.repository.interface';
import { IUserRepository, USER_REPOSITORY } from '../../../domain/repositories/user.repository.interface';
import { IMailService, MAIL_SERVICE } from '../../../domain/services/mail.service.interface';
import { Email } from '../../../domain/value-objects/email.vo';

export interface SendEmailVerificationCodeCommand {
  email: string;
}

@Injectable()
export class SendEmailVerificationCodeUseCase {
  constructor(
    @Inject(EMAIL_VERIFICATION_CODE_REPOSITORY)
    private readonly emailVerificationCodeRepository: IEmailVerificationCodeRepository,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(MAIL_SERVICE)
    private readonly mailService: IMailService,
  ) {}

  async execute(command: SendEmailVerificationCodeCommand): Promise<void> {
    const email = new Email(command.email);

    // ตรวจสอบว่ามี user กับ email นี้หรือไม่
    const user = await this.userRepository.findByEmail(email.value);
    if (!user) {
      throw new Error('ไม่พบผู้ใช้งานกับอีเมลนี้');
    }

    // ตรวจสอบว่า email ยืนยันแล้วหรือยัง
    if (user.isEmailVerified) {
      throw new Error('อีเมลนี้ได้รับการยืนยันแล้ว');
    }

    // ลบรหัสยืนยันเก่าที่ยังไม่ได้ใช้
    await this.emailVerificationCodeRepository.deleteByEmail(email.value);

    // สร้างรหัสยืนยันใหม่
    const verificationCode = EmailVerificationCode.createWithGeneratedCode(email.value, 10);

    // บันทึกรหัสยืนยัน
    await this.emailVerificationCodeRepository.save(verificationCode);

    // ส่งอีเมลรหัสยืนยัน
    await this.mailService.sendEmailVerificationCode(email.value, verificationCode.code);
  }
}