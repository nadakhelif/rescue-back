import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { Server } from "socket.io";
import { GatewaySessionManager } from "../ChatGateway/gateway-session-manager";
import { AuthenticatedSocket } from "../ChatGateway/AuthenticatedSocket";
import { AnnonceService } from "../annonce/annonce.service";
import {forwardRef, Inject} from "@nestjs/common";

class Notification {
    user_id: number;
    post_id: number;
    message: string;
}


@WebSocketGateway({ cors: { origin: '*' } })
export class NotifGateway implements OnGatewayConnection, OnGatewayDisconnect{
    private readonly offlineMessages: Map<number, Notification[]>;

    constructor(private readonly sessions: GatewaySessionManager,
                @Inject(forwardRef(() => AnnonceService))
                private readonly annonceService: AnnonceService) {
        this.offlineMessages = new Map<number, Notification[]>();
    }

    @WebSocketServer()
    server: Server;

    @SubscribeMessage('Notification')
    onMessage(@MessageBody() body: Notification, @ConnectedSocket() client: AuthenticatedSocket) {
        const socket = this.sessions.getUserSocket(body.user_id);
        const post = this.annonceService.findOne(body.post_id);
        const msg = body.message + client.user.firstname;
        const message = { msg, post };

        if (socket) {
            socket.emit('Notif', message);
        } else {
            // User is not connected, store the notification as an offline message
            const offlineMsgs = this.offlineMessages.get(body.user_id) || [];
            offlineMsgs.push(body);
            this.offlineMessages.set(body.user_id, offlineMsgs);
        }
    }

    // // Method to retrieve and emit offline messages when a user connects to the WebSocket server
    handleConnection(socket: AuthenticatedSocket) {
        console.log('Incoming Connection');
        const userId = socket.user.id;
        socket.emit('connected', {});
        if (userId) {
            const offlineMsgs = this.offlineMessages.get(userId);
            if (offlineMsgs && offlineMsgs.length > 0) {
                offlineMsgs.forEach((message) => {
                    socket.emit('Notif', message);
                });
                this.offlineMessages.delete(userId);
            }
        }
    }

    handleDisconnect(socket: AuthenticatedSocket) {
        console.log('handleDisconnect');
        console.log(`${socket.user.firstname} disconnected.`);
        this.sessions.removeUserSocket(socket.user.id);
    }
}
