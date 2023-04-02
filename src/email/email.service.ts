import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
  constructor(private mailService: MailerService) {}
  async sendVerificationEmail(to: string, id: number, userToken: string) {
    const verificationLink = `http://localhost:3000/auth/verify/${id}/${userToken}`;
    const response = await this.mailService.sendMail({
      to: 'nadakhelif888@gmail.com',
      from: 'nadakhelif61@gmail.com',
      subject: 'Please verify your email address',
      text: 'Please verify your email address',
      html: `
        <p>Dear user,</p>
        <p>Please click on the following link to verify your email address:</p>
        <p><a href="${verificationLink}">${verificationLink}</a></p>
      `,
    });
    console.log(response);
    return response;
  }

  async sendPasswordResetEmail(to: string, userId: string, resetToken: string) {
    const resetLink = `https://example.com/reset-password/${userId}/${resetToken}`;
    const response = await this.mailService.sendMail({
      to: to,
      from: 'nadakhelif61@gmail.com',
      subject: 'Password reset request',
      text: 'Password reset request',
      html: `
        <p>Dear user,</p>
        <p>Please click on the following link to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
      `,
    });
    return response;
  }
}
