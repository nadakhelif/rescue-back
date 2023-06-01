import {forwardRef, Module} from '@nestjs/common';
import {NotifGateway} from "./gateway";
import {AnnonceModule} from "../annonce/annonce.module";
import {GatewaySessionManager} from "../ChatGateway/gateway-session-manager";

@Module({
    imports: [forwardRef(() => AnnonceModule ),] ,
    providers: [NotifGateway,GatewaySessionManager],
    exports: [GatewaySessionManager],
})
export class NotifModule {

}
