import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { IMailService } from "../domain/services/mail.service.interface";


@Injectable()
export class MailService implements IMailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService
  ) {}

  async sendEmailVerification(email: string, token: string): Promise<void> {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const url = `${baseUrl}/auth/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
    });
  }

  async sendEmailVerificationCode(email: string, code: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email,
      subject: 'รหัสยืนยันอีเมล - Email Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; text-align: center;">รหัสยืนยันอีเมล</h2>
          <p style="color: #666; font-size: 16px;">กรุณาใช้รหัสยืนยันด้านล่างเพื่อยืนยันอีเมลของคุณ:</p>
          <div style="background-color: #f8f9fa; border: 2px dashed #007bff; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${code}</h1>
          </div>
          <p style="color: #666; font-size: 14px;">รหัสนี้จะหมดอายุใน 10 นาที</p>
          <p style="color: #999; font-size: 12px;">หากคุณไม่ได้ขอรหัสนี้ กรุณาเพิกเฉยต่ออีเมลนี้</p>
        </div>
      `,
    });
  }

  async sendPasswordReset(email: string, token: string): Promise<void> {
    const baseUrl = this.configService.get<string>('BASE_URL');
    const url = `${baseUrl}/auth/reset-password?token=${token}`;
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      html: `<p>Click <a href="${url}">here</a> to reset your password</p>`,
    });
  }
}
