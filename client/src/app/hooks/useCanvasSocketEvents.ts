"use client";
import { useEffect } from "react";
import { toast } from "sonner";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

export function useCanvasSocketEvents(
  socket: Socket<DefaultEventsMap, DefaultEventsMap>,
  clear: () => void
) {
  useEffect(() => {
    socket.on("clear", clear);
    socket.on("clear-failed", () => {
      toast.error("Sorry! Only Room Creator Can Clear The Canvas");
    });

    return () => {
      socket.off("clear", clear);
      socket.off("clear-failed");
    };
  }, [socket, clear]);
}
