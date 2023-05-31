import {
  ForbiddenException,
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user';
import { UserService } from 'src/user/user.service';
import {
  GetConversationMessagesParams,
  UpdateConversationParams,
} from 'src/generic/types/type';

@Injectable()
export class ConversationService {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  async createConversation(
    creator: User,
    createConversationDto: CreateConversationDto,
  ) {
    const { email, message: content } = createConversationDto;
    const recipient = await this.userService.findUser(email);
    if (!recipient) throw new NotFoundException();
    if (creator.id === recipient.id)
      throw new ForbiddenException('Cannot create Conversation with yourself');

    const exists = await this.isCreated(creator.id, recipient.id);
    if (exists) {
      const existingConversation = await this.conversationRepository.findOne({
        where: [
          { creator: { id: creator.id }, recipient: { id: recipient.id } },
          { creator: { id: creator.id }, recipient: { id: recipient.id } },
        ],
      });
      return existingConversation;
    }
    console.log("heyyy baad exists")
    const newConversation = this.conversationRepository.create({
      creator,
      recipient,
    });
    const conversation = await this.conversationRepository.save(
      newConversation,
    );
    console.log(conversation)
    const newMessage = this.messageRepository.create({
      content,
      conversation,
      author: creator,
    });
    conversation.last_message_sent= newMessage;
    this.conversationRepository.save(conversation);
    // const criteres= {id : newConversation.id , last_message_sent:newMessage};
    // console.log("kbal l update")
    // await this.update(criteres);
    console.log("after the update")
    await this.messageRepository.save(newMessage);
    return conversation;
  }

  async save(conversation: Conversation): Promise<Conversation> {
    return await this.conversationRepository.save(conversation);
  }

  async isCreated(userId: number, recipientId: number) {
    return this.conversationRepository.findOne({
      where: [
        {
          creator: { id: userId },
          recipient: { id: recipientId },
        },
        {
          creator: { id: recipientId },
          recipient: { id: userId },
        },
      ],
    });
  }

  async getConversations(id: number): Promise<Conversation[]>{
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .leftJoinAndSelect('conversation.creator', 'creator')
      .leftJoinAndSelect('conversation.recipient', 'recipient')
      .where('creator.id = :id', { id })
      .orWhere('recipient.id = :id', { id })
      .orderBy('conversation.updatedAt', 'DESC')
      .getMany();
  }

  async findById(id: number) {
    return this.conversationRepository.findOne({
      where: { id },
      relations: ['creator', 'recipient', 'last_message_sent'],
    });
  }

  getMessages({
    id,
    limit,
  }: GetConversationMessagesParams): Promise<Conversation> {
    return this.conversationRepository
      .createQueryBuilder('conversation')
      .where('id = :id', { id })
      .leftJoinAndSelect('conversation.last_message_sent', 'last_message_sent')
      .leftJoinAndSelect('conversation.messages', 'message')
      .where('conversation.id = :id', { id })
      .orderBy('message.createdAt', 'DESC')
      .limit(limit)
      .getOne();
  }

  // async update({ id, last_message_sent }: UpdateConversationParams) {
  //   console.log("fil update")
  //   return await this.conversationRepository.update(id, { last_message_sent });
  // }

  async remove(id: number) {
    return await this.conversationRepository.softDelete(id);
  }
}
