"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { getSocket } from "@/utils/socket";
import { ToolBar } from "@/components/ToolBar";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/hooks/useUserData";
import CursorRender from "./CursorRender";
import CanvasHeader from "./CanvasHeader";
import { toast } from "sonner";
import Canvas from "./canvas";

const socket = getSocket();

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
    toast.success("Canvas Cleared Successfully!");
  }, []);

  const leaveRoom = () => {
    if (!socket || !roomId) return;

    socket.emit("leave-room", roomId);

    // Redirect to the home or lobby page after leaving
    router.push("/");
  };

  useEffect(() => {
    if (!roomId) {
      router.push("/");
      return;
    }

    socket.emit("check-room", roomId);

    socket.once("room-check-result", (data) => {
      if (data.exists) {
        socket.emit("join-room", roomId);
        socket.emit("client-ready", roomId); // Request canvas state
        setIsLoading(false);
      } else {
        router.push("/");
      }
    });

    return () => {
      socket.off("room-check-result");
    };
  }, [roomId, router]);

  useEffect(() => {
    if (isLoading) return;

    socket.on("user-joined-room", (useremail) => {
      toast.info(`${useremail.split("@")[0]} has joined the room`);
    });

    socket.on("user-left-room", (useremail) => {
      toast.info(`${useremail.split("@")[0]} has left the room`);
    });

    socket.on("user-left-room", (useremail) => {
      toast.info(`${useremail.split("@")[0]} has left the room`);
    });

    // socket.on("clear-failed", () => {
    //   toast.error("Sorry! Only Admins Can Delete The Canvas");
    // });

    socket.on("clear", clear);

    return () => {
      socket.off("user-joined-room");
      socket.off("user-left-room");
      socket.off("user-left-room");
      socket.off("clear");
    };
  }, [isLoading, clear]);

  const sendRoomInfo = () => {
    if (isLoading) return;
    socket.emit("send-room-info", {
      userData,
      room: roomId,
    });

    console.log("rooominfo sended", roomId);
  };

  sendRoomInfo();

  const HandleClearCanvas = () => {
    // console.log("room id clear", roomId);
    // socket.emit("clear-perm", { roomId, userData });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading Room...</p>
      </div>
    );
  }

  return (
    <div className="flex relative  flex-col justify-center items-center gap-4 py-2">
      <CanvasHeader />
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
          userData={userData}
          roomId={roomId}
          tool={tool}
          strokeWidth={strokeWidth}
          color={color}
          isLoading={isLoading}
        />
        <CursorRender divElem={divRef.current} />
      </div>
    </div>
  );
};

export default RoomPage;
