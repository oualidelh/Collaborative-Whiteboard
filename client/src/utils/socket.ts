import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://localhost:5000"; // Change this for production

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"], // Use WebSocket for better performance
    });
  }
  return socket;
};
