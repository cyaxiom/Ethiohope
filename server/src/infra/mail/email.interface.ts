export interface IEmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
  replyTo?: string;
}

export interface IEmailProvider {
  sendEmail(options: IEmailOptions): Promise<void>;
}
