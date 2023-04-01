import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async verifyEmail(userId: number, verificationToken: string): Promise<User> {
    try {
      const user = await this.userService.findOne(userId);

      if (user.verificationToken === verificationToken) {
        user.verified = true;
        const updatedUser = await this.userService.changeVerifyToTrue(userId);
        return updatedUser;
      } else if (user.verificationToken !== verificationToken) {
        return user;
      }
    } catch (error) {
      throw new ConflictException(`verify email token is incorrect`);
    }
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.getByEmail(email);

    if (!user) throw new NotFoundException('email ou password erronée');
    const match = await bcrypt.compare(password, user.password);
    if (match) {
      return user;
    } else {
      throw new NotFoundException('username or password wrong');
    }
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    const payload = { email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async receiveEmailForPasswordReset(email: string) {
    try {
      const user = await this.userService.getByEmail(email);
      if (user) {
        const resetToken = await this.userService.createPasswordResetToken(
          user.id,
        );
        // this.emailService.sendPasswordResetEmail(
        //   email,
        //   resetToken.userId,
        //   resetToken.token,
        // );
      } else {
        throw Error('The provided email is invalid!');
      }
      return { message: 'Password Reset Link Has Been Sent!' };
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(userId: number, resetTokenP: string, password: string) {
    try {
      const resetToken = await this.userService.verifyPasswordResetToken(
        userId,
        resetTokenP,
      );
      if (!resetToken) {
        throw Error('The provided token is invalid!');
      }
      await this.userService.changePassword(userId, password);
      await this.userService.deletePasswordResetToken(resetTokenP);
      return { message: 'Your password was successfully changed!' };
    } catch (error) {
      throw error;
    }
  }
}
