import express from "express";
import http from "http";
import { Server } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://collaborative-whiteboard-one.vercel.app/",
    credentials: true,
  },
});

// room

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

interface ManageUserRoomArgs {
  socket: any;
  roomId: string;
  userData: { id: string; email: string };
  users: User[];
}

function manageUserRoom({
  socket,
  roomId,
  userData,
  users,
}: ManageUserRoomArgs) {
  const existingUser = users.find((user) => user.userId === userData.id);

  if (existingUser) {
    if (existingUser.room !== roomId) {
      socket.leave(existingUser.room);
      socket.to(existingUser.room).emit("user-left-room", userData.email);
      const userOldRoom = existingUser.room;
      existingUser.room = roomId;
      const remainingUsers = users.filter((user) => user.room === userOldRoom);
      io.to(userOldRoom).emit("update-users", { users: remainingUsers });

      const roomInfo = rooms.find((r) => r.roomId === userOldRoom);
      if (roomInfo) {
        io.to(userOldRoom).emit("room-info", {
          roomName: roomInfo.roomName,
          users: remainingUsers,
        });
      }
      console.log("User moved to new room:", roomId, remainingUsers);
    } else {
      console.log("User already in the correct room.");
    }
  } else {
    users.push({
      socketId: socket.id,
      userId: userData.id,
      email: userData.email,
      room: roomId,
    });
    console.log("New user added to room:", roomId);
  }
}

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("create-room", ({ id, email, roomId, roomName }) => {
    socket.join(roomId);
    rooms.push({ userId: id, roomId: roomId, email, roomName });

    canvasStates[roomId] = null; // Initialize empty state
    socket.emit("room-created", roomId);
  });

  socket.on("check-room", (roomId) => {
    const roomExists = rooms.some((r) => r.roomId === roomId);
    socket.emit("room-check-result", { exists: roomExists });
  });

  socket.on("join-room", ({ roomId, userData }) => {
    if (!userData || !userData.id) {
      console.warn("Invalid userData received");
      return;
    } else {
      console.log("valid user data");
    }

    const room = rooms.find((r) => r.roomId === roomId);
    if (room) {
      socket.join(roomId);

      socket.to(roomId).emit("user-joined-room", userData?.email);

      manageUserRoom({ socket, roomId, userData, users });

      io.to(roomId).emit("update-users", {
        users: users.filter((user) => user.room === roomId),
      });

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
        existingUser.room = room;
        existingUser.currentPoint = currentPoint;
        existingUser.tool = tool;
        existingUser.cursorColor = cursorColor;
      } else {
        users.push({
          socketId: socket.id,
          userId: userData.id,
          email: userData.email,
          room,
          currentPoint: currentPoint,
          tool: tool,
          cursorColor: cursorColor,
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
    // console.log("the room info sended", room);
    if (!userData || !userData.id) return;

    const existingUser = users.find((user) => user.userId === userData.id);
    if (existingUser) {
      existingUser.socketId = socket.id;
      room;
    } else {
      users.push({
        socketId: socket.id,
        userId: userData.id,
        email: userData.email,
        room,
      });
    }
    // Send room info separately
    const roomInfo = rooms.find((r) => r.roomId === room);
    const roomName = roomInfo?.roomName ? roomInfo.roomName : "Unknown";
    if (roomInfo) {
      io.to(room).emit("room-info", {
        roomName: roomName,
        users: users.filter((user) => user.room === room),
      });
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
      // List all users in the room
      const clientsInRoom = io.sockets.adapter.rooms.get(room);
      const userCount = clientsInRoom ? clientsInRoom.size : 0;
    }
  );

  socket.on("clear-perm", ({ roomId, userData }) => {
    const existRoom = rooms.find((r) => r.roomId === roomId);
    if (!existRoom) return;
    if (existRoom.userId === userData.id) {
      canvasStates[roomId] = null;
      io.to(roomId).emit("clear");
    } else {
      socket.emit("clear-failed");
    }
  });

  socket.on("leave-room", (roomId) => {
    const userIndex = users.findIndex((user) => user.socketId === socket.id);

    if (userIndex !== -1) {
      const userEmail = users[userIndex].email;

      // Remove user from users array
      users.splice(userIndex, 1);

      // Notify remaining users in the room
      socket.to(roomId).emit("user-left-room", userEmail);

      // Check if the room is now empty
      const remainingUsers = users.filter((user) => user.room === roomId);
      if (remainingUsers.length === 0) {
        // Remove room from rooms array
        const roomIndex = rooms.findIndex((room) => room.roomId === roomId);
        if (roomIndex !== -1) {
          rooms.splice(roomIndex, 1);
        }
        delete canvasStates[roomId]; // Remove canvas state
      }

      // Broadcast updated user list to remaining users
      io.to(roomId).emit("update-users", { users: remainingUsers });

      // Broadcast updated room info
      const roomInfo = rooms.find((r) => r.roomId === roomId);
      if (roomInfo) {
        io.to(roomId).emit("room-info", {
          roomName: roomInfo.roomName,
          users: remainingUsers,
        });
      }
    }
    // Leave the room
    socket.leave(roomId);
  });

  socket.on("disconnect", () => {
    // Remove user from the users array
    const userIndex = users.findIndex((user) => user.socketId === socket.id);
    if (userIndex !== -1) {
      const room = users[userIndex].room;
      const userEmail = users[userIndex].email;
      socket.to(room).emit("user-left-room", userEmail);
      users.splice(userIndex, 1);
      console.log(
        "users update disconnect ",
        users.filter((user) => user.room === room)
      );
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
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
