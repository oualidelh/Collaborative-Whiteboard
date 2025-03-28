"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/utils/socket";
import { ToolBar } from "@/components/ToolBar";
import { convertToAbsolute } from "@/utils/convertToAbsolute";
import LeaveRoom from "./LeaveRoom";
import { useRouter } from "next/navigation";
import { useUserData } from "@/app/hooks/useUserData";
import { computePointInCanvas } from "@/utils/computePoints";
import CursorRender from "./CursorRender";
import CanvasHeader from "./CanvasHeader";

const socket = getSocket();

const RoomPage = ({ roomId }: { roomId: string }) => {
  const { userData } = useUserData();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const divRef = useRef<HTMLDivElement | null>(null);
  const { onMouseDown, clear } = useDraw(createLine, canvasRef);
  const [tool, setTool] = useState<"default" | "pen" | "eraser">("default");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

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

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("Received canvas state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear before applying state
        ctx.drawImage(img, 0, 0);
      };
    });

    socket.on(
      "draw-line",
      ({
        prevPoint,
        currentPoint,
        color,
        tool,
        strokeWidth,
      }: DrawLineProps) => {
        const { absCurrentPoint, absPrevPoint } = convertToAbsolute(
          currentPoint,
          prevPoint,
          canvas
        );
        drawLine({
          prevPoint: absPrevPoint,
          currentPoint: absCurrentPoint,
          ctx,
          color,
          tool,
          strokeWidth,
        });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
      socket.off("canvas-state-from-server");
      socket.off("clear");
    };
  }, [isLoading, strokeWidth, clear, roomId, userData, tool]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      color,
      tool,
      strokeWidth,
      room: roomId,
    });

    requestAnimationFrame(() => {
      const { absCurrentPoint, absPrevPoint } = convertToAbsolute(
        currentPoint,
        prevPoint,
        canvas
      );
      drawLine({
        prevPoint: absPrevPoint,
        currentPoint: absCurrentPoint,
        ctx,
        color,
        tool,
        strokeWidth,
      });
    });
  }

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const state = canvasRef.current.toDataURL();
    socket.emit("canvas-state", { room: roomId, state });
  };

  const mouseMoveHandler = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Convert the React event to a native DOM event
    const nativeEvent = e.nativeEvent;
    const computedCurrentPoint = computePointInCanvas(nativeEvent, canvas);

    if (!computedCurrentPoint) return; // Handle null case

    socket.emit("user-state", {
      userData,
      room: roomId,
      currentPoint: computedCurrentPoint,
      tool,
    });
  };

  const sendRoomInfo = () => {
    socket.emit("send-room-info", {
      userData,
      room: roomId,
    });

    console.log("sendfromroompage header");
  };
  sendRoomInfo();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading Room...</p>
      </div>
    );
  }

  return (
    <div className="flex relative flex-col justify-center items-center gap-4 py-2">
      <CanvasHeader />
      <ToolBar
        selectedTool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        HandleClearCanvas={() => socket.emit("clear", roomId)}
      />
      <div
        ref={divRef}
        className="relative shadow-md rounded-lg
                 w-[90vw] h-[90vw] max-w-[750px] max-h-[750px]
                 sm:w-[600px] sm:h-[600px]
                 md:w-[700px] md:h-[700px]
                 lg:w-[750px] lg:h-[750px]"
      >
        <canvas
          ref={canvasRef}
          width={750}
          height={750}
          onMouseMove={mouseMoveHandler}
          onMouseDown={onMouseDown}
          onMouseUp={saveCanvasState}
          className="w-full h-full bg-white rounded-lg"
        />
        <LeaveRoom roomId={roomId} />
        <CursorRender divElem={divRef.current} />
      </div>
    </div>
  );
};

export default RoomPage;
