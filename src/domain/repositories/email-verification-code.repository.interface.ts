import { EmailVerificationCode } from '../entities/email-verification-code.entity';

export const EMAIL_VERIFICATION_CODE_REPOSITORY = 'EMAIL_VERIFICATION_CODE_REPOSITORY';

export interface IEmailVerificationCodeRepository {
  save(code: EmailVerificationCode): Promise<EmailVerificationCode>;
  findByEmailAndCode(email: string, code: string): Promise<EmailVerificationCode | null>;
  findLatestByEmail(email: string): Promise<EmailVerificationCode | null>;
  deleteExpiredCodes(): Promise<void>;
  deleteByEmail(email: string): Promise<void>;
}