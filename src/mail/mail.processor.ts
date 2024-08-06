import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { MailerService } from '@nestjs-modules/mailer';
import { queueName, queueProcessName } from 'src/core/config/queue.config';

@Processor(queueName.mail)
export class MailProcessor {
  constructor(private mailerService: MailerService) {}
  @Process(queueProcessName.sendMail)
  async sendMail(job: Job) {
    const { email, subject, template, context } = job.data;
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context,
    });
  }
}
