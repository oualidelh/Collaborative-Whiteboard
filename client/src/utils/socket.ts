// import { io, Socket } from "socket.io-client";

// const SOCKET_URL = "http://localhost:5000";

// let socket: Socket | null = null;

// export const GetSocket = (): Socket => {
//   if (!socket) {
//     socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//     });
//   }
//   return socket;
// };

// "https://collaborative-whiteboard-2xlo.onrender.com"

import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

const SOCKET_URL = "http://localhost:5000";

let socket: Socket | null = null;
let hasDisconnectedBefore = false;

export const GetSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
    });

    socket.on("connect", () => {
      if (!socket) return;

      if (hasDisconnectedBefore) {
        const savedRoom = localStorage.getItem("room");
        const savedUserData = localStorage.getItem("user");

        if (savedRoom && savedUserData) {
          console.log(
            "🔁 Rejoining after reconnect:",
            JSON.parse(savedRoom),
            JSON.parse(savedUserData)
          );
          socket.emit("reconnection-info", {
            room: JSON.parse(savedRoom),
            user: JSON.parse(savedUserData),
          });
        }

        console.log("✅ Reconnected to server:", socket.id);
      } else {
        console.log("✅ Initial connection to server:", socket.id);
      }
    });

    socket.on("disconnect", () => {
      hasDisconnectedBefore = true;
      toast.warning("Disconnected from server. Trying to reconnect...");
    });

    socket.on("reconnect_attempt", () => {
      console.log("🔄 Trying to reconnect...");
    });

    socket.on("reconnect", () => {
      toast.success("Reconnected!");
    });

    socket.on("connect_error", (err) => {
      toast.error(
        `You Lost Connection To Server, The Page Gonna Reload, ${err.message}`
      );
    });
  }

  return socket;
};
