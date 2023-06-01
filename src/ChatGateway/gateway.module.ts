import { Module } from '@nestjs/common';
import {GatewaySessionManager} from "./gateway-session-manager";
import {ChatGateway} from "./gateway";

@Module({
    imports: [],
    providers: [GatewaySessionManager, ChatGateway],
    exports: [GatewaySessionManager],

})
export class GatewayModule {}