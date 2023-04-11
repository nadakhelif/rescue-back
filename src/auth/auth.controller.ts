import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @Get('verify/:userId/:verificationToken')
  async verifyUser(
    @Param('userId') id: string,
    @Param('verificationToken') verificationToken: string,
  ) {
    const result = await this.authService.verifyEmail(+id, verificationToken);
    return result;
  }
  @Post('resetpassword')
  async resetPasswordS(@Body() body: any) {
    return await this.authService.receiveEmailForPasswordReset(body.email);
  }

  @Post('/resetpassword/:userId/:resetToken')
  async resetPasswordE(
    @Body() body: any,
    @Param('userId') userId: string,
    @Param('resetToken') resetToken: string,
  ) {
    return await this.authService.resetPassword(
      +userId,
      resetToken,
      body.password,
    );
  }
}
