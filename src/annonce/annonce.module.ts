import { Module, forwardRef } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnonceEntity } from './entities/annonce';
import { AnimalService } from 'src/animal/animal.service';
import { AnimalEntity } from 'src/animal/entities/animal/animal';
import { AnimalModule } from 'src/animal/animal.module';
import { CrudService } from 'src/common/crud.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user';
import { PasswordReset } from 'src/auth/entities/passwordReset.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnnonceEntity]),
    AnnonceModule,
    TypeOrmModule.forFeature([AnimalEntity]),
    forwardRef(() => AnimalModule),
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PasswordReset]),
    CrudService,
  ],
  providers: [
    AnnonceService,
    CrudService,
    AnimalService,
    UserService,
    JwtService,
    EmailService,
  ],
  controllers: [AnnonceController],
})
export class AnnonceModule {}
