import { io, Socket } from "socket.io-client";

const SOCKET_URL = "https://collaborative-whiteboard-2xlo.onrender.com";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
    });
  }
  return socket;
};
