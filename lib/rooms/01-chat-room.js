"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
class ChatRoom extends colyseus_1.Room {
    constructor() {
        super(...arguments);
        // this room supports only 4 clients connected
        this.maxClients = 4;
    }
    onCreate(options) {
        console.log("BasicRoom created!", options);
    }
    onJoin(client) {
        this.broadcast(`${client.sessionId} joined.`);
    }
    onLeave(client) {
        this.broadcast(`${client.sessionId} left.`);
    }
    onMessage(client, data) {
        console.log("BasicRoom received message from", client.sessionId, ":", data);
        this.broadcast(`(${client.sessionId}) ${data.message}`);
    }
    onDispose() {
        console.log("Dispose BasicRoom");
    }
}
exports.ChatRoom = ChatRoom;
