import { Module, forwardRef } from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { Conversation } from './entities/conversation.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from 'src/message/message.module';
import { UserModule } from 'src/user/user.module';
import { Message } from 'src/message/entities/message.entity';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService],
  imports: [
    TypeOrmModule.forFeature([Conversation, Message]),
    forwardRef(() => MessageModule),
    UserModule,
  ],
  exports: [ConversationService],
})
export class ConversationModule {}
