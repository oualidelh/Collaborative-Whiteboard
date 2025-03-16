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

interface Room {
  userId: string;
  roomId: string;
  email: string;
  roomName: string;
}

const rooms: Room[] = [];

type Point = { x: number; y: number };

type DrawLine = {
  prevPoint: Point | null;
  currentPoint: Point;
  color: string;
  tool: string | null;
  strokeWidth: number;
};
type CreateRoom = {
  id: string;
  email: string;
  roomName: string;
};

// Store canvas states per room
const canvasStates: Record<string, string | null> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("createRoom", ({ id, email, roomName }: CreateRoom) => {
    socket.join(id);
    rooms.push({ userId: id, roomId: socket.id, email, roomName });
    socket.emit("room-created", socket.id);
    console.log("roomdidcreated", socket.id);
  });

  socket.on("check-room", (roomId) => {
    const roomExists = rooms.some((r) => r.roomId === roomId);

    console.log("roomexists", roomExists);

    // Send back room existence info
    socket.emit("room-check-result", { exists: roomExists });
  });

  socket.on("join-room", (roomId) => {
    const room = rooms.find((r) => r.roomId === roomId);

    if (room) {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);

      // Send existing canvas state (if applicable)
      if (canvasStates[roomId]) {
        socket.emit("canvas-state-from-server", canvasStates[roomId]);
      }

      // Notify other users in the room
      socket.to(roomId).emit("user-joined", {
        message: `User ${socket.id} joined room: ${roomId}`,
      });
    }
  });

  socket.on("client-ready", (room) => {
    socket.to(room).emit("get-canvas-state");
  });

  socket.on("canvas-state", ({ state, room }) => {
    console.log(`Received canvas state for room ${room}`);
    canvasStates[room] = state; // Save the canvas state for the room
    socket.to(room).emit("canvas-state-from-server", state);
  });

  socket.on(
    "draw-line",
    ({
      prevPoint,
      currentPoint,
      color,
      tool,
      strokeWidth,
      room,
    }: DrawLine & { room: string }) => {
      socket.to(room).emit("draw-line", {
        prevPoint,
        currentPoint,
        color,
        tool,
        strokeWidth,
      });
    }
  );

  socket.on("clear", (room) => {
    canvasStates[room] = null; // Reset canvas state
    io.to(room).emit("clear");
  });

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
    console.log(`${socket.id} left room: ${roomId}`);

    // Notify other users in the room
    socket.to(roomId).emit("user-left", {
      message: `User ${socket.id} left the room.`,
    });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
