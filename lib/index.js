"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const serve_index_1 = __importDefault(require("serve-index"));
const cors_1 = __importDefault(require("cors"));
const http_1 = require("http");
const colyseus_1 = require("colyseus");
const monitor_1 = require("@colyseus/monitor");
// Import demo room handlers
const _01_chat_room_1 = require("./rooms/01-chat-room");
const _02_state_handler_1 = require("./rooms/02-state-handler");
const _03_auth_1 = require("./rooms/03-auth");
const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
// Attach WebSocket Server on HTTP Server.
const gameServer = new colyseus_1.Server({
    server: http_1.createServer(app),
    express: app,
});
// Register ChatRoom as "chat"
gameServer.define("chat", _01_chat_room_1.ChatRoom);
// Register ChatRoom with initial options, as "chat_with_options"
// onInit(options) will receive client join options + options registered here.
gameServer.define("chat_with_options", _01_chat_room_1.ChatRoom, {
    custom_options: "you can use me on Room#onCreate"
});
// Register StateHandlerRoom as "state_handler"
gameServer.define("state_handler", _02_state_handler_1.StateHandlerRoom);
// Register StateHandlerRoom as "state_handler"
gameServer.define("auth", _03_auth_1.AuthRoom);
app.use('/', express_1.default.static(path_1.default.join(__dirname, "static")));
app.use('/', serve_index_1.default(path_1.default.join(__dirname, "static"), { 'icons': true }));
// (optional) attach web monitoring panel
app.use('/colyseus', monitor_1.monitor());
gameServer.onShutdown(function () {
    console.log(`game server is going down.`);
});
gameServer.listen(port);
// process.on("uncaughtException", (e) => {
//   console.log(e.stack);
//   process.exit(1);
// });
console.log(`Listening on http://localhost:${port}`);
