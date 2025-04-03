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
  currentPoint?: Point;
  tool?: string;
  cursorColor?: string;
}

const users: User[] = [];
const rooms: Room[] = [];

const canvasStates: Record<string, string | null> = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("createRoom", ({ id, email, roomName }) => {
    socket.join(socket.id);
    rooms.push({ userId: id, roomId: socket.id, email, roomName });
    canvasStates[socket.id] = null; // Initialize empty state
    console.log("rooom created", rooms);
    socket.emit("room-created", socket.id);
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

      io.to(roomId).emit("room-info", {
        roomName: room.roomName,
        users: users.filter((user) => user.room === roomId),
      });
    }
  });

  socket.on("user-joined", ({ roomId, userData }) => {
    socket.to(roomId).emit("user-joined-room", userData?.email);
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

  socket.on(
    "user-state",
    ({ userData, room, currentPoint, tool, cursorColor }) => {
      if (!userData || !userData.id) return;

      const existingUser = users.find((user) => user.userId === userData.id);
      if (existingUser) {
        existingUser.socketId = socket.id;
        existingUser.currentPoint = currentPoint;
        existingUser.tool = tool;
        existingUser.cursorColor = cursorColor;
      } else {
        users.push({
          socketId: socket.id,
          userId: userData.id,
          email: userData.email,
          room,
          currentPoint,
          tool,
          cursorColor,
        });
      }

      // Send only users update
      io.to(room).emit("update-users", {
        users: users.filter((user) => user.room === room),
      });
      const roomInfo = rooms.find((r) => r.roomId === room);
      const roomName = roomInfo?.roomName ? roomInfo.roomName : "Unknown";
      if (roomInfo) {
        io.to(room).emit("room-info", {
          roomName: roomName,
          users: users.filter((user) => user.room === room),
        });
      }
    }
  );

  socket.on("send-room-info", ({ userData, room }) => {
    console.log("the room info sended", room);
    if (!userData || !userData.id) return;

    const existingUser = users.find((user) => user.userId === userData.id);
    if (existingUser) {
      existingUser.socketId = socket.id;
    } else {
      users.push({
        socketId: socket.id,
        userId: userData.id,
        email: userData.email,
        room,
      });
    }

    console.log("user info received");
    console.log("userss", users);
    // Send room info separately
    const roomInfo = rooms.find((r) => r.roomId === room);
    const roomName = roomInfo?.roomName ? roomInfo.roomName : "Unknown";
    if (roomInfo) {
      io.to(room).emit("room-info", {
        roomName: roomName,
        users: users.filter((user) => user.room === room),
      });
      console.log(
        "rooom info to client",
        roomName,
        users.filter((user) => user.room === room)
      );
    }
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
      console.log("is sending draw line from client", room);
    }
  );

  // socket.on("clear-perm", ({ roomId, userData }) => {
  //   const existRoom = rooms.find((r) => r.roomId === roomId);
  //   console.log("room-cleared", rooms, userData.id, "thr room", roomId);
  //   if (!existRoom) return;
  //   console.log("room-exist", existRoom.userId, userData.id);
  //   if (existRoom.userId === userData.id) {
  //     canvasStates[roomId] = null;
  //     io.to(roomId).emit("clear");
  //   } else {
  //     socket.to(socket.id).emit("clear-failed");
  //   }
  // });

  // socket.on("clear", (room) => {
  //   canvasStates[room] = null;
  //   io.to(room).emit("clear");
  // });

  // socket.on("leave-room", (roomId) => {
  //   const userIndex = users.findIndex((user) => user.socketId === socket.id);

  //   if (userIndex !== -1) {
  //     const userEmail = users[userIndex].email;

  //     // Remove user from users array
  //     users.splice(userIndex, 1);

  //     // Notify remaining users in the room
  //     socket.to(roomId).emit("user-left-room", userEmail);

  //     // Check if the room is now empty
  //     const remainingUsers = users.filter((user) => user.room === roomId);
  //     if (remainingUsers.length === 0) {
  //       // Remove room from rooms array
  //       const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
  //       if (roomIndex !== -1) {
  //         rooms.splice(roomIndex, 1);
  //       }
  //       delete canvasStates[roomId]; // Remove canvas state
  //     }

  //     // Broadcast updated user list to remaining users
  //     io.to(roomId).emit("update-users", remainingUsers);

  //     // Broadcast updated room info
  //     const roomInfo = rooms.find((r) => r.roomId === roomId);
  //     if (roomInfo) {
  //       io.to(roomId).emit("room-info", {
  //         roomName: roomInfo.roomName,
  //         users: remainingUsers,
  //       });
  //     }
  //   }
  //   // Leave the room
  //   socket.leave(roomId);
  // });

  socket.on("disconnect", () => {
    // Remove user from the users array
    const userIndex = users.findIndex((user) => user.socketId === socket.id);
    if (userIndex !== -1) {
      const room = users[userIndex].room;
      const userEmail = users[userIndex].email;
      socket.to(room).emit("user-left-room", userEmail);
      users.splice(userIndex, 1);
      io.to(room).emit(
        "update-users",
        users.filter((user) => user.room === room)
      );

      const roomInfo = rooms.find((r) => r.roomId === room);
      const roomName = roomInfo?.roomName ? roomInfo.roomName : "Unknown";
      if (roomInfo) {
        io.to(room).emit("room-info", {
          roomName: roomName,
          users: users.filter((user) => user.room === room),
        });
      }
    }
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
