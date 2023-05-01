/* eslint-disable prettier/prettier */
import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './entities/user';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PasswordReset } from '../auth/entities/passwordReset.entity';
import { EmailModule } from '../email/email.module';
import { JwtStrategy } from 'src/strategy/passport.jwt';
import { AnnonceService } from 'src/annonce/annonce.service';
import { AnnonceEntity } from 'src/annonce/entities/annonce';
import { AnnonceModule } from 'src/annonce/annonce.module';
import { AnimalService } from 'src/animal/animal.service';
import { CrudService } from 'src/common/crud.service';
import { AnimalEntity } from 'src/animal/entities/animal/animal';

@Module({
  imports: [
    EmailModule,
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PasswordReset]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([AnnonceEntity]),
    AnnonceModule,
    TypeOrmModule.forFeature([AnimalEntity]),
    forwardRef(() => AnnonceModule),
  ],
  controllers: [UserController],
  providers: [
    UserService,
    JwtStrategy,
    AnnonceService,
    AnimalService,
    CrudService,
  ],
  exports: [UserService],
})
export class UserModule {}
