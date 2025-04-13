"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { GetSocket } from "@/utils/socket";
import { ToolBar } from "@/components/ToolBar";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/hooks/useUserData";
import CursorRender from "./CursorRender";
import CanvasHeader from "./CanvasHeader";
import { toast } from "sonner";
import Canvas from "./canvas";
import { useReloadPage } from "@/app/hooks/useReloadPage";
import { useRoomSocket } from "@/app/hooks/useRoomSocket";
import { useCanvasSocketEvents } from "@/app/hooks/useCanvasSocketEvents";

const socket = GetSocket();

const RoomPage = ({ roomId }: { roomId: string }) => {
  const { userData } = useUserData();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const [tool, setTool] = useState<"default" | "pen" | "eraser">("default");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const state = canvas.toDataURL();
    localStorage.setItem("canvasState", state);
    toast.success("Admin Has Cleared The Canvas!");
  }, []);

  const leaveRoom = useCallback(() => {
    if (!socket || !roomId) return;
    socket.emit("leave-room", roomId);
    router.push("/");
  }, [roomId, router]);

  useRoomSocket({ socket, roomId, userData, setIsLoading });
  useCanvasSocketEvents(socket, clear);
  useReloadPage(roomId, socket);

  // send room info only once after loading
  useEffect(() => {
    if (!isLoading) {
      socket.emit("send-room-info", {
        userData,
        room: roomId,
      });
      console.log("🔌 useEffect triggered");
    }
    return () => {
      console.log("🧹 useEffect cleanup");
    };
  }, [isLoading, userData, roomId]);

  const HandleClearCanvas = () => {
    socket.emit("clear-perm", { roomId, userData });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading Room...</p>
      </div>
    );
  }

  return (
    <div className="flex relative flex-col justify-center items-center gap-4 py-2">
      <CanvasHeader socket={socket} />
      <ToolBar
        selectedTool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        HandleClearCanvas={HandleClearCanvas}
        leaveRoom={leaveRoom}
      />
      <div
        ref={divRef}
        className="relative shadow-md rounded-lg
                 w-[90vw] h-[90vw] max-w-[750px] max-h-[750px]
                 sm:w-[600px] sm:h-[600px]
                 md:w-[700px] md:h-[700px]
                 lg:w-[750px] lg:h-[750px]"
      >
        <Canvas
          canvasRef={canvasRef}
          socket={socket}
          userData={userData}
          roomId={roomId}
          tool={tool}
          strokeWidth={strokeWidth}
          color={color}
          isLoading={isLoading}
        />
        <CursorRender socket={socket} divElem={divRef.current} />
      </div>
    </div>
  );
};

export default RoomPage;
