import {Socket} from "socket.io";
import {User} from "../user/entities/user";

export class AuthenticatedSocket extends Socket{
    user: User;
}