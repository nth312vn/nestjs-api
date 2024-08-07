import { MailerService } from '@nestjs-modules/mailer';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Queue } from 'bull';
import { envKey } from 'src/core/config/envKey';
import { queueName, queueProcessName } from 'src/core/config/queue.config';

@Injectable()
export class SendMailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
    @InjectQueue(queueName.mail) private readonly mailQueue: Queue,
  ) {}
  async sendPasswordReset(email: string, token: string) {
    const url = `${this.configService.get<string>(envKey.FRONTEND_URL)}/reset-password?token=${token}`;
    await this.mailQueue.add(
      queueProcessName.sendMail,
      {
        email,
        template: 'reset-password',
        subject: 'Password Reset Request',
        context: {
          name: email,
          url,
        },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
  async sendVerificationEmail(email: string, url: string) {
    await this.mailQueue.add(
      queueProcessName.sendMail,
      {
        email,
        template: 'verify-email',
        subject: 'Email Verification',
        context: { name: email, url },
      },
      {
        removeOnComplete: true,
        removeOnFail: true,
      },
    );
  }
}
