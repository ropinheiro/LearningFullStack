import path from "path";
import express, { Express, NextFunction, Request, Response } from "express";
// import { serverInfo } from "./ServerInfo";
// import * as IMAP from "./IMAP";
// import * as SMTP from "./SMTP";
// import * as Contacts from "./Contacts";
// import { IContact } from "./Contacts";

const app: Express = express();

app.use(express.json());

app.use("/", express.static(path.join(__dirname, "../../client/dist")));

app.use(function (
  inRequest: Request,
  inResponse: Response,
  inNext: NextFunction
) {
  // Bypass CORS restrictions by allowing calls from all domains
  inResponse.header("Access-Control-Allow-Origin", "*");
  // Restrict the HTTP methods that the clients can use
  inResponse.header("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
  // Restrict the headers that the clients can use
  inResponse.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,Accept"
  );
  inNext();
});