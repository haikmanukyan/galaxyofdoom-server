"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const colyseus_1 = require("colyseus");
const superagent_1 = __importDefault(require("superagent"));
const FACEBOOK_APP_TOKEN = "135829507120512|3a97320bee18f2286d6243dcf4cc7a23";
class AuthRoom extends colyseus_1.Room {
    onCreate(options) {
        console.log("StateHandlerRoom created!", options);
    }
    onAuth(client, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield superagent_1.default.get(`https://graph.facebook.com/debug_token`).
                query({
                input_token: options.accessToken,
                access_token: FACEBOOK_APP_TOKEN
            }).
                set('Accept', 'application/json');
            return response.body.data;
        });
    }
    onJoin(client, options, auth) {
        console.log(client.sessionId, "joined successfully");
        console.log("Auth data: ", auth);
    }
    onLeave(client) {
        console.log(client.sessionId, "left");
    }
    onMessage(client, data) {
        console.log("AuthRoom received message from", client.sessionId, ":", data);
    }
    onDispose() {
        console.log("Dispose AuthRoom");
    }
}
exports.AuthRoom = AuthRoom;
