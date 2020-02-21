import { Room, Client, generateId } from "colyseus";
import { Schema, type, MapSchema, ArraySchema } from "@colyseus/schema";

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

class Action extends Schema {
  @type("boolean")
  isComplete: boolean = false;
}

class MoveAction extends Action {
  @type(Vector)
  destination: Vector = new Vector();

  @type("number")
  stoppingDistance: number = 0;
}

class Unit extends Schema {
  @type("string")
  uid: string = "";

  @type(["number"])
  position: ArraySchema<number> = new ArraySchema<number>();
}

class Player extends Schema {
  @type("number")
  color: number = 0;

  @type(["number"])
  position = new ArraySchema<number>();

  @type({ map: Unit })
  units = new MapSchema<Unit>();
}

class LobbyState extends Schema {
  @type({ map: Unit })
  units : MapSchema<Unit> = new MapSchema<Unit>();

  @type({ map: Player })
  players : MapSchema<Player> = new MapSchema<Player>();

  unitPositions : Map<string, Array<number>> = new Map<string, Array<number>>();
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
    this.state.players[client.sessionId] = player;
    this.broadcast({
      "type":"newPlayer",
      "uid":client.id,
      "color":player.color
    })
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
    if (data.type == "getPlayers") {
      var playerIds:Array<string> = new Array<string>();
      var playerColors:Array<number> = new Array<number>();
      for (let id in state.players) {
        playerIds.push(id);
        playerColors.push(state.players[id].color);
      }

      this.send(client, {
        "type":"playerList",
        "players":playerIds,
        "colors":playerColors
      });
    }
    if (data.type == "newUnit") {
      state.unitPositions[data.unit] = data.position;
      // var unit: Unit = new Unit();
      // unit.uid = data.uid;
      // state.units[data.uid] = unit;
    }
    if (data.type == "getUnitById") {
      console.log(state.unitPositions, state.unitPositions[data.uid]);
      if (state.unitPositions[data.uid]) {
        console.log("Sent", state.unitPositions[data.uid]);
        this.send(client, {
          "type":"unitInfo",
          "uid":data.uid, 
          "position":state.unitPositions[data.uid]
        })
      }
    }

    if (data.type == "command") {
      this.broadcast({
        "type": "command",
        "playerId": client.sessionId,
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