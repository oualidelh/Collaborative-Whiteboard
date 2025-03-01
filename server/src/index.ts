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

const users = [];

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

  socket.on("client-ready", () => {
    socket.broadcast.emit("get-canvas-state");
  });

  socket.on("canvas-state", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("canvas-state-from-server", state);
  });

  socket.on("savedHistory", (state) => {
    console.log("received canvas state");
    socket.broadcast.emit("savedHistory-from-server", state);
  });

  socket.on("canvas-state-undo", (state) => {
    console.log("received canvas undo");
    console.log("the state undo", state);
    socket.broadcast.emit("canvas-state-undo-from-server", state);
  });

  socket.on("canvas-state-redo", (state) => {
    socket.broadcast.emit("canvas-state-redo-from-server", state);
  });

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

  socket.on("clear", () => io.emit("clear"));
});

server.listen(5000, () => {
  console.log("server running in port 5000");
});
