import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards, Inject,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { AuthUser } from 'src/decorators/authUser.decorator';
import { User } from 'src/user/entities/user';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
import {EventEmitter2, OnEvent} from '@nestjs/event-emitter';
import {CreateMessageResponse} from "../generic/types/type";


@UseGuards(JwtAuthGuard)
@Controller('conversations/:id/messages')
export class MessageController {
  constructor(private readonly messageService: MessageService,
             private eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async createMessage(
    @AuthUser() user: User,
    @Param('id', ParseIntPipe) id: number,
    @Body() { content }: CreateMessageDto,
  ) {
    const params = { user, id, content };
    const response = await this.messageService.createMessage(params);
    this.eventEmitter.emit('message.create', response);
    console.log("event emitted and response : ");
    return;
  }

  // @OnEvent('message.create')
  // handleMessage(payload: CreateMessageResponse) {
  //   console.log('Inside message.create');
  //   console.log('payloaaaadddd : ', payload);
  // }

  @Get()
  findAll(@Param('id', ParseIntPipe) id: number) {
    return this.messageService.getMessages(id);
  }
  // @Delete(':messageId')
  // async deleteMessageFromConversation(
  //     @AuthUser() user: User,
  //     @Param('id', ParseIntPipe) conversationId: number,
  //     @Param('messageId', ParseIntPipe) messageId: number,
  // ) {
  //   const params = { userId: user.id, conversationId, messageId };
  //   await this.messageService.deleteMessage(params);
  //   //this.eventEmitter.emit('message.delete', params);
  //   return { conversationId, messageId };
  // }

  // @Patch(':messageId')
  // update(
  //   @AuthUser() user: User,
  //   @Param('ConversationId', ParseIntPipe) conversationId: number,
  //   @Param('messageId', ParseIntPipe) messageId: number,
  //   @Body() { content }: UpdateMessageDto,
  // ) {
  //   const params = {
  //     conversationId,
  //     messageId,
  //     userId: user.id,
  //     content,
  //   };
  //   const msg = this.messageService.editMessage(params);
  //   // this.eventEmitter('message.update',msg);
  //   return msg;
  //}
}
