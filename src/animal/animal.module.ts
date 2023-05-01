import { Module, forwardRef } from '@nestjs/common';
import { AnimalService } from './animal.service';
import { AnimalController } from './animal.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnimalEntity } from './entities/animal/animal';
import { AnnonceService } from 'src/annonce/annonce.service';
import { AnnonceEntity } from 'src/annonce/entities/annonce';
import { AnnonceModule } from 'src/annonce/annonce.module';
import { CrudService } from 'src/common/crud.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user';
import { PasswordReset } from 'src/auth/entities/passwordReset.entity';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([AnimalEntity]),
    AnimalModule,
    forwardRef(() => AnnonceModule),
    TypeOrmModule.forFeature([AnnonceEntity]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([PasswordReset]),
    //AnnonceModule,
  ],
  providers: [
    AnimalService,
    AnnonceService,
    CrudService,
    UserService,
    JwtService,
    EmailService,
  ],
  controllers: [AnimalController],
})
export class AnimalModule {}
