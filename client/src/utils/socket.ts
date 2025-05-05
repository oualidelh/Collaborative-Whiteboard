// // import { io, Socket } from "socket.io-client";

// // const SOCKET_URL = "http://localhost:5000";

// // let socket: Socket | null = null;

// // export const GetSocket = (): Socket => {
// //   if (!socket) {
// //     socket = io(SOCKET_URL, {
// //       transports: ["websocket"],
// //     });
// //   }
// //   return socket;
// // };

// // "https://collaborative-whiteboard-2xlo.onrender.com"

// import { io, Socket } from "socket.io-client";
// import { toast } from "sonner";

// // socket url
// const SOCKET_URL = "http://localhost:5000";

// let socket: Socket | null = null;
// let hasDisconnectedBefore = false;

// export const GetSocket = (): Socket => {
//   if (!socket) {
//     socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//       reconnectionDelayMax: 10000,
//     });

//     socket.on("connect", () => {
//       if (!socket) return;

//       if (hasDisconnectedBefore) {
//         const savedRoom = localStorage.getItem("room");
//         const savedUserData = localStorage.getItem("user");

//         if (savedRoom && savedUserData) {
//           console.log(
//             "🔁 Rejoining after reconnect:",
//             JSON.parse(savedRoom),
//             JSON.parse(savedUserData)
//           );
//           socket.emit("reconnection-info", {
//             room: JSON.parse(savedRoom),
//             user: JSON.parse(savedUserData),
//           });
//         }

//         console.log("✅ Reconnected to server:", socket.id);
//       } else {
//         console.log("✅ Initial connection to server:", socket.id);
//       }
//     });

//     socket.on("disconnect", () => {
//       hasDisconnectedBefore = true;
//       toast.warning("Disconnected from server. Trying to reconnect...");
//     });

//     socket.on("reconnect_attempt", () => {
//       console.log("🔄 Trying to reconnect...");
//     });

//     socket.on("reconnect", () => {
//       toast.success("Reconnected!");
//     });

//     socket.on("connect_error", (err) => {
//       toast.error(
//         `You Lost Connection To Server, The Page Gonna Reload, ${err.message}`
//       );
//     });
//   }

//   return socket;
// };

// import { io, Socket } from "socket.io-client";
// import { toast } from "sonner";

// // socket url
// const SOCKET_URL = "http://localhost:5000";

// let socket: Socket | null = null;
// let hasDisconnectedBefore = false;
// let isReconnecting = false;

// export const GetSocket = (): Socket => {
//   if (!socket) {
//     socket = io(SOCKET_URL, {
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: Infinity,
//       reconnectionDelay: 2000,
//       reconnectionDelayMax: 10000,
//       // Add a longer timeout for operations
//       timeout: 20000,
//     });

//     socket.on("connect", () => {
//       if (!socket) return;

//       if (hasDisconnectedBefore) {
//         const savedRoom = localStorage.getItem("room");
//         const savedUserData = localStorage.getItem("user");

//         if (savedRoom && savedUserData) {
//           console.log(
//             "🔁 Rejoining after reconnect:",
//             JSON.parse(savedRoom),
//             JSON.parse(savedUserData)
//           );
//           socket.emit("reconnection-info", {
//             room: JSON.parse(savedRoom),
//             user: JSON.parse(savedUserData),
//           });
//         }

//         console.log("✅ Reconnected to server:", socket.id);
//       } else {
//         console.log("✅ Initial connection to server:", socket.id);
//       }

//       // Reset reconnecting flag when successfully connected
//       isReconnecting = false;
//     });

//     socket.on("disconnect", () => {
//       hasDisconnectedBefore = true;
//       toast.warning("Disconnected from server. Trying to reconnect...");
//       // Don't reload the page here, just let socket.io handle reconnection
//     });

//     socket.on("reconnect_attempt", () => {
//       console.log("🔄 Trying to reconnect...");
//       isReconnecting = true;
//     });

//     socket.on("reconnect", () => {
//       toast.success("Reconnected!");
//       isReconnecting = false;
//     });

//     socket.on("reconnect_failed", () => {
//       // Only reload if all reconnection attempts have failed
//       if (!isReconnecting) {
//         toast.error(
//           "Failed to reconnect after multiple attempts. Reloading..."
//         );
//         setTimeout(() => {
//           window.location.reload();
//         }, 3000); // Give time for the user to see the toast
//       }
//     });

//     socket.on("connect_error", (err) => {
//       // Don't reload immediately on connection error
//       // console.error("Connection error:", err.message);
//       toast.error(
//         `Connection error: ${err.message}. Attempting to reconnect...`
//       );

//       // Let the reconnection system handle it
//       // Only reload if it's a persistent issue
//       if (!isReconnecting) {
//         // Wait to see if reconnection succeeds
//         setTimeout(() => {
//           if (!socket?.connected) {
//             toast.error("Unable to connect. Reloading page in 5 seconds...");
//             setTimeout(() => {
//               window.location.reload();
//             }, 5000);
//           }
//         }, 10000); // Wait 10 seconds before deciding to reload
//       }
//     });
//   }

//   return socket;
// };

import { io, Socket } from "socket.io-client";
import { toast } from "sonner";

// socket url
const SOCKET_URL = "https://collaborative-whiteboard-2xlo.onrender.com";

let socket: Socket | null = null;
let hasDisconnectedBefore = false;
let isReconnecting = false;

// Add a variable to track the last time we sent a large payload
let lastLargePayloadTime = 0;
const LARGE_PAYLOAD_COOLDOWN = 2000; // 2-second cooldown

export const GetSocket = (): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      // Increase the timeout for operations
      timeout: 30000,
      // Increase maximum payload size
      // maxHttpBufferSize: 5e6, // 5MB
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
        toast.success("Reconnected to server!");
      } else {
        console.log("✅ Initial connection to server:", socket.id);
      }

      // Reset reconnecting flag when successfully connected
      isReconnecting = false;
    });

    socket.on("disconnect", (reason) => {
      hasDisconnectedBefore = true;
      console.log("❌ Disconnected from server. Reason:", reason);
      toast.warning(
        `Disconnected from server. Reason: ${reason}. Trying to reconnect...`
      );
      // Don't reload the page here, just let socket.io handle reconnection
    });

    socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Trying to reconnect... (Attempt #${attemptNumber})`);
      isReconnecting = true;
    });

    socket.on("reconnect", () => {
      toast.success("Reconnected!");
      isReconnecting = false;
    });

    socket.on("reconnect_failed", () => {
      // Only reload if all reconnection attempts have failed
      if (!isReconnecting) {
        toast.error(
          "Failed to reconnect after multiple attempts. Reloading..."
        );
        setTimeout(() => {
          // window.location.reload();
        }, 3000); // Give time for the user to see the toast
      }
    });

    socket.on("connect_error", (err) => {
      // Don't reload immediately on connection error
      // console.error("Connection error:", err.message);
      toast.error(
        `Connection error: ${err.message}. Attempting to reconnect...`
      );

      // Let the reconnection system handle it
      // Only reload if it's a persistent issue
      if (!isReconnecting) {
        // Wait to see if reconnection succeeds
        setTimeout(() => {
          if (!socket?.connected) {
            toast.error("Unable to connect. Reloading page in 5 seconds...");
            setTimeout(() => {
              // window.location.reload();
            }, 5000);
          }
        }, 10000); // Wait 10 seconds before deciding to reload
      }
    });

    // Add handler for error events
    socket.on("error", (error) => {
      console.error("Socket error:", error);
      toast.error(`Socket error: ${error.message || "Unknown error"}`);
    });
  }

  return socket;
};

// Helper function to check if we can send a large payload
export const canSendLargePayload = (): boolean => {
  const now = Date.now();
  if (now - lastLargePayloadTime > LARGE_PAYLOAD_COOLDOWN) {
    lastLargePayloadTime = now;
    return true;
  }
  return false;
};

// Safely emit events with large payloads
// export const safeEmit = <T>(
//   eventName: string,
//   data: T,
//   room?: string
// ): void => {
//   const socket = GetSocket();

//   try {
//     // For large payloads like images, use the helper function
//     if (eventName.includes("state") || eventName.includes("style")) {
//       if (!canSendLargePayload()) {
//         console.log("Throttling large payload, too soon after last one");
//         return;
//       }

//       // Data size warning
//       if (typeof data === "string" && data.length > 1e6) {
//         console.log(
//           `Warning: Large payload (${(data.length / 1e6).toFixed(
//             2
//           )}MB) being sent`
//         );
//       }
//     }

//     // Emit with room if provided
//     if (room) {
//       socket.emit(eventName, { ...data, room });
//     } else {
//       socket.emit(eventName, data);
//     }
//   } catch (error) {
//     console.error(`Error emitting ${eventName}:`, error);

//     if (error instanceof Error) {
//       toast.error(`Failed to send data: ${error.message}`);
//     } else {
//       toast.error("Failed to send data: Unknown error");
//     }
//   }
// };
