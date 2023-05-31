import { Conversation } from 'src/conversation/entities/conversation.entity';
import { Message } from 'src/message/entities/message.entity';
import { User } from 'src/user/entities/user';

export type CreateMessageParams = {
  id: number;
  content?: string;
  user: User;
};
export type EditMessageParams = {
  conversationId: number;
  messageId: number;
  userId: number;
  content: string;
};
export type CreateMessageResponse = {
  message: Message;
  conversation: Conversation;
};

export type DeleteMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};

export type FindMessageParams = {
  userId: number;
  conversationId: number;
  messageId: number;
};
export type GetConversationMessagesParams = {
  id: number;
  limit: number;
};
export type UpdateConversationParams = {
  id: number;
  last_message_sent: Message;
};
