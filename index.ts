import path from 'path';
import express from 'express';
import serveIndex from 'serve-index';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'colyseus';
import { monitor } from '@colyseus/monitor';

// Import demo room handlers
import { Lobby } from "./rooms/Lobby";

const port = Number(process.env.PORT || 2567) + Number(process.env.NODE_APP_INSTANCE || 0);
const app = express();

app.use(cors());
app.use(express.json());

// Attach WebSocket Server on HTTP Server.
const gameServer = new Server({
  server: createServer(app),
  express: app,
});

gameServer.define("lobby", Lobby);

app.use('/colyseus', monitor());

gameServer.onShutdown(function(){
  console.log(`game server is going down.`);
});

gameServer.listen(port);

process.on("uncaughtException", (e) => {
  console.log(e.stack);
  process.exit(1);
});

console.log(`Listening on http://localhost:${ port }`);

// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="/__/firebase/7.9.0/firebase-app.js"></script>

// <!-- TODO: Add SDKs for Firebase products that you want to use
//      https://firebase.google.com/docs/web/setup#available-libraries -->
// <script src="/__/firebase/7.9.0/firebase-analytics.js"></script>

// <!-- Initialize Firebase -->
// <script src="/__/firebase/init.js"></script>