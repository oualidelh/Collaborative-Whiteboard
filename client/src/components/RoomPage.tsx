"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { getSocket } from "@/utils/socket";
import { ToolBar } from "@/components/ToolBar";
import { convertToAbsolute } from "@/utils/convertToAbsolute";
import LeaveRoom from "./LeaveRoom";
import { useRouter } from "next/navigation";

const socket = getSocket();

const RoomPage = ({ roomId }: { roomId: string }) => {
  console.log("roomId", roomId);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseDown, clear } = useDraw(createLine, canvasRef);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
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
        socket.emit("join-room", { roomId });
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
  }, [isLoading, strokeWidth, clear]);

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

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const state = canvasRef.current.toDataURL();
    socket.emit("canvas-state", { room: roomId, state });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold animate-pulse">Loading Room...</p>
      </div>
    );
  }

  return (
    <div className="flex relative flex-col justify-center items-center gap-4 py-5">
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
          onMouseDown={onMouseDown}
          onMouseUp={saveCanvasState} // Save state when drawing stops
          className="w-full h-full bg-white rounded-lg"
        />
        <LeaveRoom roomId={roomId} />
      </div>
    </div>
  );
};

export default RoomPage;
