import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ConversationService } from './conversation.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { UpdateConversationDto } from './dto/update-conversation.dto';
import { User } from 'src/user/entities/user';
import { Conversation } from './entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { AuthUser } from 'src/decorators/AuthUser.decorator';
import { GetConversationMessagesParams } from 'src/generic/types/type';
import { JwtAuthGuard } from 'src/auth/Guards/jwt-auth.guard';
// mahouch yodkhol lel guard , lezmou yetriguel
@UseGuards(JwtAuthGuard)
@Controller('conversation')
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Post('create')
  createConversation(
    @AuthUser() creator: User,
    @Body() createConversationDto: CreateConversationDto,
  ) {
    console.log("in the controller")
    return this.conversationService.createConversation(
      creator,
      createConversationDto,
    );
  }

  @Get('getAll/:id')
  getConversations(@Param('id', ParseIntPipe) id: number) {
    return this.conversationService.getConversations(id);
  }

  @Get('getById/:id')
  getConversationById(@Param('id', ParseIntPipe) id: number) {
    return this.conversationService.findById(id);
  }


  @Get('getMsgs/:id')
  getMessages(@Param() getConversationMsgs: GetConversationMessagesParams) {
    return this.conversationService.getMessages(getConversationMsgs);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.conversationService.remove(+id);
  }
}
