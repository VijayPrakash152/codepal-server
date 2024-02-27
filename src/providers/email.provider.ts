import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as pug from 'pug';
import { MailSentDto } from 'src/dto/user.dto';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  constructor(
    private mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(mailReq: MailSentDto) {
    try {
      this.logger.log(
        `Sending email to ${mailReq.to} for email verification`,
      );
      const html = pug.renderFile(
        process.cwd() +
          '/templates/' +
          "verifyEmail" +
          '.pug',
        mailReq.mailContext,
      );
      await this.mailerService.sendMail({
        to: mailReq.to,
        from: this.configService.get('SES_FROM_MAIL'),
        subject: "Verification Email",
        html: html,
      });
      this.logger.log(`Email send successfully to ${mailReq.to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${mailReq.to}`);
      this.logger.error(error);
    }
  }
}