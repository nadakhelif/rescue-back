import { PartialType } from '@nestjs/mapped-types';
import { CreateConversationDto } from './create-conversation.dto';
import { Message } from 'src/message/entities/message.entity';

export class UpdateConversationDto extends PartialType(CreateConversationDto) {
  id: number;
  lastMessageSent: Message;
}
