import { Controller, Get } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}
  @Get('mail')
  async validatemail() {
    await this.emailService.sendVerificationEmail(
      'nadakhelif61@gmailcom',
      123,
      '123',
    );
  }
}
