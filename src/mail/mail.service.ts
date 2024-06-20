import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { envKey } from 'src/core/config/envKey';

@Injectable()
export class SendMailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendPasswordReset(email: string, token: string) {
    const url = `${this.configService.get<string>(envKey.FRONTEND_URL)}/reset-password?token=${token}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Password Reset Request',
      template: './reset-password',
      context: {
        name: email,
        url,
      },
    });
  }
  async sendVerificationEmail(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Email Verification',
      template: './verify-email',
      context: {
        name: email,
        url,
      },
    });
  }
}
