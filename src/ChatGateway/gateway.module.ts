import { Module } from '@nestjs/common';
import {ConversationModule} from "../conversation/conversation.module";
import {MessageModule} from "../message/message.module";
import {GatewaySessionManager} from "./gateway-session-manager";
import {UserModule} from "../user/user.module";
import {EventEmitterModule} from "@nestjs/event-emitter";

@Module({
    imports: [ConversationModule,UserModule, MessageModule,EventEmitterModule.forRoot()],
    providers: [ GatewaySessionManager ],
    exports: [GatewaySessionManager],

})
export class GatewayModule {}