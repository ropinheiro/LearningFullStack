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
