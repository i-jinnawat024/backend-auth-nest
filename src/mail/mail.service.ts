import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";


@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(to: string, token: string) {
    const url = `http://localhost:3000/auth/verify-email?token=${token}`;
    await this.mailerService.sendMail({
      to,
      subject: 'Verify your email',
      html: `<p>Click <a href="${url}">here</a> to verify your email</p>`,
    });
  }
}
