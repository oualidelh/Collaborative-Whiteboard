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

type Point = { x: number; y: number };

interface User {
  socketId: string;
  userId: string;
  email: string;
  room: string;
  currentPoint: Point;
  tool: string;
}

const users: User[] = [];
const rooms: Room[] = [];

const canvasStates: Record<string, string | null> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("createRoom", ({ id, email, roomName }) => {
    socket.join(id);
    rooms.push({ userId: id, roomId: id, email, roomName });
    canvasStates[id] = null; // Initialize empty state
    socket.emit("room-created", id);
  });

  socket.on("check-room", (roomId) => {
    const roomExists = rooms.some((r) => r.roomId === roomId);
    socket.emit("room-check-result", { exists: roomExists });
  });

  socket.on("join-room", (roomId) => {
    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      socket.join(roomId);
      console.log(`${socket.id} joined room: ${roomId}`);

      // Send existing canvas state
      if (canvasStates[roomId]) {
        socket.emit("canvas-state-from-server", canvasStates[roomId]);
      }
    }
  });

  socket.on("client-ready", (room) => {
    if (canvasStates[room]) {
      socket.emit("canvas-state-from-server", canvasStates[room] || "");
    }
  });

  socket.on("canvas-state", ({ state, room }) => {
    canvasStates[room] = state;
    socket.to(room).emit("canvas-state-from-server", state);
  });

  socket.on("user-state", ({ userData, room, currentPoint, tool }) => {
    if (!userData || !userData.id) {
      console.error("Invalid userData received:", userData);
      return;
    }

    console.log("userpoints", currentPoint);
    // Find existing user
    const existingUser = users.find((user) => user.userId === userData.id);

    if (existingUser) {
      existingUser.socketId = socket.id; // Update socket ID in case of reconnect
      existingUser.currentPoint = currentPoint;
      existingUser.tool = tool;
    } else {
      // Add new user
      users.push({
        socketId: socket.id,
        userId: userData.id,
        email: userData.email,
        room,
        currentPoint,
        tool,
      });
    }

    console.log("users", users);
    // Send updated user list to the room
    io.to(room).emit(
      "update-users",
      users.filter((user) => user.room === room)
    );
  });

  socket.on(
    "draw-line",
    ({ prevPoint, currentPoint, color, tool, strokeWidth, room }) => {
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
    canvasStates[room] = null;
    io.to(room).emit("clear");
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);

    // Remove user from the users array
    const userIndex = users.findIndex((user) => user.socketId === socket.id);
    if (userIndex !== -1) {
      const room = users[userIndex].room;
      users.splice(userIndex, 1);
      io.to(room).emit(
        "update-users",
        users.filter((user) => user.room === room)
      );
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
