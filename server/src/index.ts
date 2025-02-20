import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  tool: string | null;
  strokeWidth: number;
};

io.on("connection", (socket) => {
  console.log("connection");
  socket.on(
    "draw-line",
    ({ prevPoint, currentPoint, color, tool, strokeWidth }: DrawLine) => {
      socket.broadcast.emit("draw-line", {
        prevPoint,
        currentPoint,
        color,
        tool,
        strokeWidth,
      });
    }
  );
});

server.listen(5000, () => {
  console.log("server running in port 5000");
});
