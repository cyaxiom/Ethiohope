import fs from 'fs';
import path from 'path';
import handlebars from 'handlebars';
import { IEmailProvider } from './email.interface';
import { NodemailerProvider } from './nodemailer.provider';
import { CLIENT_URL } from '@config/env';

export class EmailService {
  private provider: IEmailProvider;

  constructor(provider?: IEmailProvider) {
    // Default to Nodemailer, but allows for dependency injection (SendGrid later)
    this.provider = provider || new NodemailerProvider();
  }

  private compileTemplate(templateName: string, replacements: object): string {
    const filePath = path.join(__dirname, 'templates', `${templateName}.html`);
    const source = fs.readFileSync(filePath, 'utf-8');
    const template = handlebars.compile(source);
    return template(replacements);
  }

  /**
   * Send Verification Email
   */
  public async sendVerificationEmail(to: string, firstname: string, token: string): Promise<void> {
    const verificationLink = `${CLIENT_URL}auth/verify-email?token=${token}`;
    
    const html = this.compileTemplate('VerifyEmail', {
      username: firstname,
      verificationLink: verificationLink,
    });

    await this.provider.sendEmail({
      to,
      subject: 'EthioHope - Verify Your Email',
      html,
    });
  }

  /**
   * Send Password Reset Email
   */
  public async sendPasswordResetEmail(to: string, firstname: string, token: string): Promise<void> {
    const resetLink = `${CLIENT_URL}reset-password?token=${token}`;
    
    const html = this.compileTemplate('ForgetPassword', {
      firstname,
      redirectURL: resetLink,
      logo: process.env.COMPANY_LOGO,
      facebook: process.env.COMPANY_FACEBOOK,
      twitter: process.env.COMPANY_TWITTER,
      instagram: process.env.COMPANY_INSTAGRAM,
      linkedin: process.env.COMPANY_LINKEDIN,
    });

    await this.provider.sendEmail({
      to,
      subject: 'EthioHope - Password Reset Request',
      html,
    });
  }

  /**
   * Send Child Credentials Email
   */
  public async sendChildCredentialsEmail(to: string, childName: string, username: string, pin: string): Promise<void> {
    const loginUrl = `${CLIENT_URL}login`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <h2>Your Child's Login Credentials - EthioHope</h2>
        <p>Dear Parent,</p>
        <p>Your payment was successful and ${childName}'s enrollment in EthioHope is now active!</p>
        <p>Below are your child's unified login credentials:</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; font-size: 16px; font-weight: bold; margin: 20px 0;">
          <p style="margin: 5px 0;">Username: <span style="color: #0056b3;">${username}</span></p>
          <p style="margin: 5px 0;">PIN: <span style="color: #0056b3;">${pin}</span></p>
        </div>
        <p>Please keep this PIN secure. Your child can use these details to login here:</p>
        <p><a href="${loginUrl}" style="background-color: #0056b3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Login to Dashboard</a></p>
        <br/>
        <p>Best regards,<br/>The EthioHope Team</p>
      </div>
    `;

    await this.provider.sendEmail({
      to,
      subject: 'Your Child Login Credentials - EthioHope',
      html,
    });
  }

  /**
   * Send Session Invitation Email
   */
  public async sendSessionNotificationEmail(to: string, data: { title: string, startTime: string, type: string }): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 30px;">
        <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">New Live Session Scheduled! 🚀</h2>
        <p>Hello,</p>
        <p>A new <strong>${data.type}</strong> has been scheduled for your program batch.</p>
        
        <div style="background-color: #f8fbff; border-left: 4px solid #0056b3; padding: 20px; border-radius: 4px; margin: 25px 0;">
          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #1a1a1a;">${data.title}</p>
          <p style="margin: 10px 0 0 0; color: #4a4a4a;">📅 <strong>Starts:</strong> ${data.startTime}</p>
        </div>

        <p>You can view and join this class directly from your <strong>Student Dashboard</strong> under the "Live Classes" section.</p>
        
        <div style="text-align: center; margin-top: 35px;">
          <a href="${CLIENT_URL}student/sessions" style="background-color: #0056b3; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">View Live Classes</a>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #888; border-top: 1px solid #eee; pt: 15px;">
          Note: Joining access is restricted to students with active enrollments. Please join 5 minutes early.
        </p>
      </div>
    `;

    await this.provider.sendEmail({
      to,
      subject: `Live Session Alert: ${data.title}`,
      html,
    });
  }

  /**
   * Send Contact Form Email
   */
  public async sendContactFormEmail(to: string, data: { name: string, email: string, message: string }): Promise<void> {
    const html = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 12px; padding: 30px;">
        <h2 style="color: #0056b3; text-align: center; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">New Contact Form Submission 📬</h2>
        <p>You have received a new message from the EthioHope contact form.</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Name:</strong> ${data.name}</p>
          <p style="margin: 5px 0;"><strong>Email:</strong> ${data.email}</p>
        </div>

        <div style="background-color: #fff; border: 1px solid #eee; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; font-weight: bold; color: #555;">Message:</p>
          <p style="margin: 10px 0 0 0; white-space: pre-wrap;">${data.message}</p>
        </div>

        <p style="font-size: 12px; color: #888; margin-top: 30px; text-align: center;">
          Sent from EthioHope Website Contact Form
        </p>
      </div>
    `;

    await this.provider.sendEmail({
      to,
      subject: `Contact Form: ${data.name}`,
      html,
      replyTo: data.email
    });
  }
}

// Export a singleton instance
export const emailService = new EmailService();
