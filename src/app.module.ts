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
import { ConversationModule } from './conversation/conversation.module';
import { MessageModule } from './message/message.module';
import appConfig from './config/app.config';
import {EventEmitterModule} from "@nestjs/event-emitter";
import {GatewayModule} from "./ChatGateway/gateway.module";

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
    EventEmitterModule.forRoot({
      // set this to true to use wildcards
      wildcard: false,
      // the delimiter used to segment namespaces
      delimiter: '.',
      // set this to true if you want to emit the newListener event
      newListener: false,
      // set this to true if you want to emit the removeListener event
      removeListener: false,
      // the maximum amount of listeners that can be assigned to an event
      maxListeners: 10,
      // show event name in memory leak message when more than maximum amount of listeners is assigned
      verboseMemoryLeak: false,
      // disable throwing uncaughtException if an error event is emitted and it has no listeners
      ignoreErrors: false,
    }),
     TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CommonModule,
    EmailModule,
    AnimalModule,
    AnnonceModule,
    ConversationModule,
    MessageModule,
    EventEmitterModule.forRoot(),
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
