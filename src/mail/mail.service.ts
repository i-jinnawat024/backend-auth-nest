import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(to: string, token: string) {
    const url = `${process.env.APP_BASE_URL}/auth/verify-email?token=${token}`;
    try {
      await this.mailerService.sendMail({
        to,
        subject: 'Verify your email',
        html: `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${url}">${url}</a>
      <p>If you did not request this, you can ignore this email.</p>
    `,
      });
    } catch (e) {
      console.error('Failed to send email:', e);
      throw new Error('Unable to send verification email');
    }
  }
}
