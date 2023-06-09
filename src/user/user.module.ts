import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PasswordReset } from '../auth/entities/passwordReset.entity';
import { EmailModule } from '../email/email.module';
import { AnnonceModule } from '../annonce/annonce.module';
import { JwtStrategy } from './strategy/passport-jwt.strategy';

const SECRET = 'secret';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PasswordReset]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
