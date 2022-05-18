import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";
import { connectionHandler } from "./controller/controller";

/* Handler */
const listenHandler = () => {
    console.log(`Listen on ${PORT}!`);
};

const app = express();
const PORT = 3000;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static(path.join(__dirname, "/public")));
app.get("/", (_, res) => res.render("home"));
//app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);

wsServer.on("connection", connectionHandler);

// app을 listen하는게 아닌 httpServer를 listen해야함.
httpServer.listen(PORT, listenHandler);
