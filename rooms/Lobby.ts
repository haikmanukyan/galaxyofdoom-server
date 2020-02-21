import { Room, Client, generateId } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";
import { DEFAULT_SEAT_RESERVATION_TIME } from "colyseus/lib/Room";

enum ActionState {
  InProgress, Complete, Failed
}

class Vector extends Schema {
  @type("number")
  x: number = 0;
  @type("number")
  y: number = 0;
  @type("number")
  z: number = 0;
}

class Unit extends Schema {
  @type("string")
  uid: string = "";
  
  @type("string")
  name: string = "";

  @type(["number"])
  position: ArraySchema<number> = new ArraySchema<number>();
}

class Player extends Schema {
  @type("string")
  uid: string = "";

  @type("number")
  color: number = 0;

  @type("string")
  name: string = "";

  @type({ map: Unit })
  units = new MapSchema<Unit>();
}

class LobbyState extends Schema {
  @type({ map: Unit })
  units : MapSchema<Unit> = new MapSchema<Unit>();

  @type({ map: Player })
  players : MapSchema<Player> = new MapSchema<Player>();
}

export class Lobby extends Room {

  onCreate (options: any) {
    console.log("DemoRoom created!", options);

    this.setState(new LobbyState());

    this.setPatchRate(1000 / 20);
    this.setSimulationInterval((dt) => this.update(dt));
  }

  onJoin (client: Client, options: any) {
    console.log("client joined!", client.sessionId);
    var player = new Player();
    player.color = Math.floor(Math.random() * 0xffffff);
    player.name = "Player";
    player.uid = client.id;

    this.state.players[client.sessionId] = player;
  }

  async onLeave (client: Client, consented: boolean) {
    this.state.players[client.sessionId].connected = false;
    
    console.log("disconnected!", client.sessionId);
    delete this.state.players[client.sessionId];
  }

  onMessage (client: Client, data: any) {
    var player: Player = this.state.players[client.sessionId];
    var state: LobbyState = this.state;
    console.log(data, "received from", client.sessionId);

    if(data.type == "getColor") {
      this.send(client, {
        "type" : "color", 
        "color":player.color
      });
    }

    if (data.type == "newUnit") {
      var unit:Unit = new Unit();
      unit.uid = data.uid;
      unit.name = data.unitName;
      unit.position.push(data.position[0])
      unit.position.push(data.position[1])
      unit.position.push(data.position[2])

      player.units[data.uid] = unit;
    }

    if (data.type == "command") {
      this.broadcast({
        "type": "command",
        "playerId": client.sessionId,
        "unitIds": data.unitIds,
        "task": data.task
      });
    }
  }

  update (dt?: number) {
    // console.log("num clients:", Object.keys(this.clients).length);
  }

  onDispose () {
    console.log("disposing DemoRoom...");
  }

}