import { Module } from '@nestjs/common';
import { AnnonceService } from './annonce.service';
import { AnnonceController } from './annonce.controller';
import { AnimalModule } from '../animal/animal.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Annonce } from './entities/annonce.entity';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user';
import { NotificationModule } from '../Notification/notification.module';
import { NotificationService } from '../Notification/notification.service';
import { NotificationEntity } from '../Notification/entities/notification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Annonce]),
    TypeOrmModule.forFeature([User]),
    AnimalModule,
    UserModule,
    NotificationModule,
    TypeOrmModule.forFeature([NotificationEntity]),
  ],
  controllers: [AnnonceController],
  providers: [AnnonceService, NotificationService],
})
export class AnnonceModule {}
