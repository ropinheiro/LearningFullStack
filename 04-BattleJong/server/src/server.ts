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

  // ...hook up message handler
  socket.on("message", (inMsg: string) => {
    console.log(`Message: ${inMsg}`);

    // Format: <message>_<player pid>_<optional data>
    const msgParts: string[] = inMsg.toString().split("_");
    const message: string = msgParts[0];
    const pid: string = msgParts[1];
    switch (message) {
      // TODO
    }
  });
});