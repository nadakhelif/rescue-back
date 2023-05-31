import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ConversationService } from 'src/conversation/conversation.service';
import { instanceToPlain } from 'class-transformer';
import { Conversation } from 'src/conversation/entities/conversation.entity';
import {
  CreateMessageParams,
  DeleteMessageParams,
  EditMessageParams,
} from 'src/generic/types/type';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => ConversationService))
    private readonly conversationService: ConversationService,
  ) {}

  async createMessage(params: CreateMessageParams) {
    const { user, content, id } = params;
    const conversation = await this.conversationService.findById(id);
    if (!conversation) throw new NotFoundException();
    const { creator, recipient } = conversation;
    if (creator.id !== user.id && recipient.id !== user.id)
      throw new ForbiddenException();
    const message = this.messageRepository.create({
      content,
      conversation,
      author: instanceToPlain(user),
    });
    const savedMessage = await this.messageRepository.save(message);
    conversation.last_message_sent = savedMessage;
    const updated = await this.conversationService.save(conversation);
    return { message: savedMessage, conversation: updated };
  }

  getMessages(conversationId: number): Promise<Message[]> {
    return this.messageRepository.find({
      relations: ['author'],
      where: { conversation: { id: conversationId } },
      order: { createdAt: 'DESC' },
    });
  }

  async editMessage(params: EditMessageParams) {
    const messageDB = await this.messageRepository.findOne({
      where: {
        id: params.messageId,
        author: { id: params.userId },
      },
      relations: [
        'conversation',
        'conversation.creator',
        'conversation.recipient',
        'author',
      ],
    });
    if (!messageDB)
      throw new HttpException('Cannot Edit Message', HttpStatus.BAD_REQUEST);
    messageDB.content = params.content;
    return this.messageRepository.save(messageDB);
  }

  // async deleteMessage(conversation: Conversation, message: Message) {
  //   const size = conversation.messages.length;
  //   const SECOND_MESSAGE_INDEX = 1;
  //   if (size <= 1) {
  //     console.log('Last Message Sent is deleted');
  //     await this.conversationService.update({
  //       id: conversation.id,
  //       last_message_sent: null,
  //     });
  //     return this.messageRepository.delete({ id: message.id });
  //   } else {
  //     console.log('There are more than 1 message');
  //     const newLastMessage = conversation.messages[SECOND_MESSAGE_INDEX];
  //     await this.conversationService.update({
  //       id: conversation.id,
  //       last_message_sent: newLastMessage,
  //     });
  //     return this.messageRepository.delete({ id: message.id });
  //   }
  // }
}
