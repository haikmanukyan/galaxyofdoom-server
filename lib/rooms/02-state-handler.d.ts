import { Room, Client } from "colyseus";
import { Schema, MapSchema } from "@colyseus/schema";
export declare class Player extends Schema {
    x: number;
    y: number;
}
export declare class State extends Schema {
    players: MapSchema<Player>;
    something: string;
    createPlayer(id: string): void;
    removePlayer(id: string): void;
    movePlayer(id: string, movement: any): void;
}
export declare class StateHandlerRoom extends Room<State> {
    maxClients: number;
    onCreate(options: any): void;
    onJoin(client: Client): void;
    onLeave(client: any): void;
    onMessage(client: any, data: any): void;
    onDispose(): void;
}
