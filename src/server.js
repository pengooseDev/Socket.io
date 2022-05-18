import express from "express";
import http from "http";
import path from "path";
import { Server } from "socket.io";

const app = express();
const httpServer = http.createServer(app);
const wsServer = new Server(httpServer);
