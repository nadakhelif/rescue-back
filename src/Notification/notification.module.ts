import {forwardRef, Module} from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {NotificationEntity} from "./entities/notification.entity";
import {UserModule} from "../user/user.module";
import {UserService} from "../user/user.service";
import {User} from "../user/entities/user";
import {PasswordReset} from "../auth/entities/passwordReset.entity";
import {JwtService} from "@nestjs/jwt";
import {EmailService} from "../email/email.service";

@Module({
  imports: [ TypeOrmModule.forFeature([NotificationEntity]),
    UserModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PasswordReset]),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, UserService,JwtService,EmailService],
  exports: [NotificationService],
})
export class NotificationModule {}
