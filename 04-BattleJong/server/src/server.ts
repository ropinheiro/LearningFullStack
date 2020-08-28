import path from "path";
import express, { Express } from "express";
import WebSocket from "ws";

// When a player connects to the server, we add an object in the form
// { pid, score: number, stillPlaying: boolean } to this players object.
const players: any = {};

// Express server
const app: Express = express();
app.use("/", express.static(path.join(__dirname, "../../client/dist")));
app.listen(80, () => {
  console.log("BattleJong Express server ready");
});

// WebSocket server
const wsServer = new WebSocket.Server({ port: 8080 }, function () {
  console.log("BattleJong WebSocket server ready");
});

// When a connection happens...
wsServer.on("connection", (socket: WebSocket) => {
  console.log("Player connected");

  // --------------------------------------------------------------------------
  // ...hook up message handler,
  // --------------------------------------------------------------------------
  socket.on("message", (inMsg: string) => {
    console.log(`Message: ${inMsg}`);

    // Format: <message>_<player pid>_<optional data>
    const msgParts: string[] = inMsg.toString().split("_");
    const message: string = msgParts[0];
    const pid: string = msgParts[1];
    switch (message) {
      // Tile pair is matched
      // Format: match_<pid>_<points>
      case "match":
        players[pid].score += parseInt(msgParts[2]);
        // Update all players' scores in all clients
        // Format: update_<pid>_<points>
        wsServer.clients.forEach(function each(inClient: WebSocket) {
          inClient.send(`update_${pid}_${players[pid].score}`);
        });

      // Player has no more moves / finished
      // Format: done_<pid>
      case "done":
        players[pid].stillPlaying = false;
        // Check if all players are done...
        let playersDone: number = 0;
        for (const player in players) {
          if (players.hasOwnProperty(player)) {
            if (!players[player].stillPlaying) {
              playersDone++;
            }
          }
        }
        // ...yes they are, so check who won
        if (playersDone === 2) {
          let winningPID: string;
          const pids: string[] = Object.keys(players);
          if (players[pids[0]].score > players[pids[1]].score) {
            winningPID = pids[0];
          } else {
            winningPID = pids[1];
          }
          // Tell all players: game is over and the winner is...
          // Format: gameOver_<winning pid>
          wsServer.clients.forEach(function each(inClient: WebSocket) {
            inClient.send(`gameOver_${winningPID}`);
          });
        }
        break;
    }
  });

  // --------------------------------------------------------------------------
  // ...initialize the player,
  // --------------------------------------------------------------------------
  const pid: string = `pid${new Date().getTime()}`;
  players[pid] = { score: 0, stillPlaying: true };

  // Inform the player its pid.
  // Format: connected_<new player's pid>
  socket.send(`connected_${pid}`);

  // --------------------------------------------------------------------------
  // ...and start the game if 2 players are connected.
  // --------------------------------------------------------------------------
  if (Object.keys(players).length === 2) {
    const shuffledLayout: number[][][] = shuffle();
    wsServer.clients.forEach(function each(inClient: WebSocket) {
      // Inform each player the game started and provide the tiles' layout
      // Format: start_<shuffledLayout>
      inClient.send(`start_${JSON.stringify(shuffledLayout)}`);
    });
  }
});

// ----------------------------------------------------------------------------
// Layout initialization
// ----------------------------------------------------------------------------

// The arrays below just define where a tile is or isn't present (1 or 0).
// Each array in the list is a layer, starting with the lower one going to the
// single central tile layer on top. Then, the shuffling part will replace the
// placeholders (the 1's) with actual tile tokens (randomly).
const layout: number[][][] = [
  [
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
    [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
  [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ],
];

// TODO: return a shuffled tiles layout
function shuffle(): number[][][] {
  const cl: number[][][] = [];
  return cl;
}
