"use client";

import { useEffect } from "react";
import { Socket } from "socket.io-client";

export const useReloadPage = (roomId: string, socket: Socket) => {
  useEffect(() => {
    const handleReload = () => {
      window.location.reload();
      const savedState = localStorage.getItem("canvasState");
      socket.emit("canvas-state-afterReload", savedState, roomId);
    };

    socket.on("reload-page", handleReload);

    return () => {
      socket.off("reload-page", handleReload);
    };
  }, [socket, roomId]);
};
