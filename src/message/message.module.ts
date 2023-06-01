import { Module, forwardRef } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { ConversationModule } from 'src/conversation/conversation.module';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import {ChatGateway} from "../ChatGateway/gateway";
import {UserService} from "../user/user.service";
import {UserModule} from "../user/user.module";

@Module({
  controllers: [MessageController],
  providers: [MessageService],
  imports: [
    TypeOrmModule.forFeature([Message, Conversation]),
    forwardRef(() => ConversationModule),
      UserModule

  ],
  exports: [MessageService],
})
export class MessageModule {}
