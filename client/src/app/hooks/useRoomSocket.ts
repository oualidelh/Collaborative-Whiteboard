// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { Socket } from "socket.io-client";
// import { DefaultEventsMap } from "@socket.io/component-emitter";

// interface Room {
//   userId: string;
//   roomId: string;
//   email: string;
//   roomName: string;
// }

// type Point = { x: number; y: number };

// interface User {
//   socketId: string;
//   userId: string;
//   email: string;
//   room: string;
//   currentPoint?: Point;
//   tool?: string;
//   cursorColor?: string;
// }

// interface UserData {
//   id: string;
//   email?: string;
// }

// export function useRoomSocket({
//   socket,
//   roomId,
//   userData,
//   setIsLoading,
// }: {
//   socket: Socket<DefaultEventsMap, DefaultEventsMap>;
//   roomId: string;
//   userData: UserData | null;
//   setIsLoading: (value: boolean) => void;
// }) {
//   const router = useRouter();

//   useEffect(() => {
//     if (!roomId) {
//       router.push("/");
//       return;
//     }

//     if (!userData) return;

//     socket.emit("check-room", roomId);

//     socket.once("room-check-result", (data) => {
//       if (data.exists) {
//         console.log("userdata inside exist ", userData.email);
//         socket.emit("join-room", { roomId, userData });
//         socket.emit("client-ready", roomId);
//         setIsLoading(false);
//       } else {
//         router.push("/");
//       }
//     });

//     return () => {
//       socket.off("room-check-result");
//     };
//   }, [roomId, router, userData, socket, setIsLoading]);

//   useEffect(() => {
//     if (!userData) return;

//     const handleUserJoin = (email: string) => {
//       toast.info(`${email?.split("@")[0]} has joined the room`);
//     };

//     const handleUserLeave = (email: string) => {
//       toast.info(`${email?.split("@")[0]} has left the room`);
//     };

//     const handleLocalStorage = (room: Room[], user: User[]) => {
//       const [roomData] = room;
//       const [userData] = user;

//       if (roomData && userData) {
//         localStorage.setItem("room", JSON.stringify(roomData));
//         localStorage.setItem("user", JSON.stringify(userData));
//       } else {
//         console.warn("Room or user data is missing.");
//       }
//     };

//     socket.on("user-joined-room", handleUserJoin);
//     socket.on("user-left-room", handleUserLeave);
//     socket.on("your-info", ({ room, user }) => {
//       handleLocalStorage(room, user);
//     });

//     return () => {
//       socket.off("user-joined-room", handleUserJoin);
//       socket.off("user-left-room", handleUserLeave);
//       socket.off("your-info");
//     };
//   }, [userData, socket]);
// }

"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Socket } from "socket.io-client";

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

interface UserData {
  id: string;
  email?: string;
}

export function useRoomSocket({
  socket,
  roomId,
  userData,
  setIsLoading,
}: {
  socket: Socket;
  roomId: string;
  userData: UserData | null;
  setIsLoading: (value: boolean) => void;
}) {
  const router = useRouter();

  // First useEffect - handle room checking and joining
  useEffect(() => {
    if (!roomId) {
      router.push("/");
      return;
    }

    if (!userData) return;

    // Check if we're coming from the HomePage (which has already verified the room)
    const comingFromHomePage =
      sessionStorage.getItem("joining-from-homepage") === roomId;

    if (comingFromHomePage) {
      // If coming from homepage, don't check room again, just join
      console.log("Coming from homepage, skipping room check");
      sessionStorage.removeItem("joining-from-homepage");
      socket.emit("join-room", { roomId, userData });
      socket.emit("client-ready", roomId);
      setIsLoading(false);
    } else {
      // Otherwise do the normal room check
      socket.emit("check-room", roomId);

      socket.once("room-check-result", (data) => {
        if (data.exists) {
          console.log("userdata inside exist ", userData.email);
          socket.emit("join-room", { roomId, userData });
          socket.emit("client-ready", roomId);
          setIsLoading(false);
        } else {
          router.push("/");
        }
      });
    }

    return () => {
      socket.off("room-check-result");
    };
  }, [roomId, router, userData, socket, setIsLoading]);

  // Second useEffect - handle socket event listeners
  useEffect(() => {
    if (!userData) return;

    const handleUserJoin = (email: string) => {
      // Only show toast if it's not our own email
      if (email !== userData.email) {
        toast.info(`${email?.split("@")[0]} has joined the room`);
      }
    };

    const handleUserLeave = (email: string) => {
      toast.info(`${email?.split("@")[0]} has left the room`);
    };

    const handleLocalStorage = (room: Room[], user: User[]) => {
      const [roomData] = room;
      const [userData] = user;

      if (roomData && userData) {
        localStorage.setItem("room", JSON.stringify(roomData));
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        console.warn("Room or user data is missing.");
      }
    };

    socket.on("user-joined-room", handleUserJoin);
    socket.on("user-left-room", handleUserLeave);
    socket.on("your-info", ({ room, user }) => {
      handleLocalStorage(room, user);
    });

    return () => {
      socket.off("user-joined-room", handleUserJoin);
      socket.off("user-left-room", handleUserLeave);
      socket.off("your-info");
    };
  }, [userData, socket]);
}
