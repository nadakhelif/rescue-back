import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket} from '@nestjs/websockets';
import {MessageService} from "../message/message.service";
import { CreateMessageResponse} from "../generic/types/type";
import {ConversationService} from "../conversation/conversation.service";
import { Server } from 'socket.io';
import {UserService} from "../user/user.service";
import {AuthenticatedSocket} from "./AuthenticatedSocket";
import { OnEvent } from '@nestjs/event-emitter';
import {IGatewaySessionManager} from "./gateway-session-manager";
import {Injectable} from "@nestjs/common";


@WebSocketGateway( {cors: {
  origin: '*'
  }})
export class ChatGateway {
  constructor(private readonly MessageService: MessageService,
              private readonly ConversationService : ConversationService,
              private readonly userService : UserService,
              private readonly sessions : IGatewaySessionManager) {}

  @WebSocketServer()
  server: Server;

  handleConnection(socket: AuthenticatedSocket, ...args: any[]) {
    console.log('Incoming Connection');
    this.sessions.setUserSocket(socket.user.id, socket);
    socket.emit('connected', {});
  }

  handleDisconnect(socket: AuthenticatedSocket) {
    console.log('handleDisconnect');
    console.log(`${socket.user.firstname} disconnected.`);
    this.sessions.removeUserSocket(socket.user.id);
  }

  @SubscribeMessage('createMessage')
  handleCreateMessage(@MessageBody() data: any) {
    console.log('Create Message');
  }

  @SubscribeMessage('onConversationJoin')
  onConversationJoin(
      @MessageBody() data: any,
      @ConnectedSocket() client: AuthenticatedSocket,
  ) {
    console.log(
        `${client.user?.id} joined a Conversation of ID: ${data.conversationId}`,
    );
    client.join(`conversation-${data.conversationId}`);
    console.log(client.rooms);
    client.to(`conversation-${data.conversationId}`).emit('userJoin');
  }
  @OnEvent('message.create')
  handleMessage(payload: CreateMessageResponse) {
    console.log('Inside message.create');
    console.log('payloaaaadddd : ', payload);
  }
  //
  // @SubscribeMessage('onConversationLeave')
  // onConversationLeave(
  //     @MessageBody() data: any,
  //     @ConnectedSocket() client: AuthenticatedSocket,
  // ) {
  //   console.log('onConversationLeave');
  //   client.leave(`conversation-${data.conversationId}`);
  //   console.log(client.rooms);
  //   client.to(`conversation-${data.conversationId}`).emit('userLeave');
  // }


  // @OnEvent('message.create')
  // handleMessage(payload: CreateMessageResponse) {
  //   console.log('Inside message.create');
  //   console.log('payloaaaadddd', payload);
  // }

  // @OnEvent('message.create')
  // handleMessageCreateEvent(payload: CreateMessageResponse) {
  //   console.log('Inside message.create');
  //   const {
  //     author,
  //     conversation: { creator, recipient },
  //   } = payload.message;
  //   console.log(payload);
  //   console.log(author);
  //
  //   const authorSocket = this.sessions.getUserSocket(author.id);
  //   const recipientSocket =
  //       author.id === creator.id
  //           ? this.sessions.getUserSocket(recipient.id)
  //           : this.sessions.getUserSocket(creator.id);
  //
  //   if (authorSocket) authorSocket.emit('onMessage', payload);
  //   if (recipientSocket) recipientSocket.emit('onMessage', payload);
  // }


  // @OnEvent('message.delete')
  // async handleMessageDelete(payload) {
  //   console.log('Inside message.delete');
  //   console.log(payload);
  //   const conversation = await this.ConversationService.findById(
  //       payload.conversationId,
  //   );
  //   if (!conversation) return;
  //   const { creator, recipient } = conversation;
  //   const recipientSocket =
  //       creator.id === payload.userId
  //           ? this.sessions.getUserSocket(recipient.id)
  //           : this.sessions.getUserSocket(creator.id);
  //   if (recipientSocket) recipientSocket.emit('onMessageDelete', payload);
  // }


}
