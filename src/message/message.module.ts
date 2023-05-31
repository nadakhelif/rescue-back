import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import {EventEmitterModule} from "@nestjs/event-emitter";

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationModule),
  ],
  exports: [MessageService],
})
export class MessageModule {}
