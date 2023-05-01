/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './common/common.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from './email/email.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { AnimalModule } from './animal/animal.module';
import { AnnonceModule } from './annonce/annonce.module';
import appConfig from './config/app.config';
import { AnnonceEntity } from './annonce/entities/annonce';
import { AnimalEntity } from './animal/entities/animal/animal';
import { User } from './user/entities/user';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.sendgrid.net',
        auth: {
          user: 'apikey',
          pass: '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',
        },
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'emna042001',
      database: 'rescue2',
      entities: [AnnonceEntity, AnimalEntity, User],
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    EmailModule,
    AnimalModule,
    AnnonceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
