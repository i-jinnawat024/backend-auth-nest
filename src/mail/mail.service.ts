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
