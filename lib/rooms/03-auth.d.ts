import { Room, Client } from "colyseus";
export declare class AuthRoom extends Room {
    onCreate(options: any): void;
    onAuth(client: Client, options: any): Promise<any>;
    onJoin(client: Client, options: any, auth: any): void;
    onLeave(client: Client): void;
    onMessage(client: Client, data: any): void;
    onDispose(): void;
}
