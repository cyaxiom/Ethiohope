import nodemailer, { Transporter } from 'nodemailer';
import { EMAIL_SERVICE, SENDER_MAIL, SENDER_PASSSWORD } from '@config/env';
import { IEmailOptions, IEmailProvider } from './email.interface';
import { logger } from '@common/utils/logger';

export class NodemailerProvider implements IEmailProvider {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: EMAIL_SERVICE,
      auth: {
        user: SENDER_MAIL,
        pass: SENDER_PASSSWORD,
      },
    });
  }

  public async sendEmail(options: IEmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: `"${process.env.COMPANY_NAME || 'EthioHope'}" <${SENDER_MAIL}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments,
        replyTo: options.replyTo,
      };

      await this.transporter.sendMail(mailOptions);
      logger.info(`[Email Service] Email sent to ${options.to}`);
    } catch (error: any) {
      logger.error(`[Email Service Error] Failed to send email to ${options.to}: ${error.message}`);
      throw error; 
    }
  }
}
