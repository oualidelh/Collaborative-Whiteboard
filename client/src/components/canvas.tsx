import { useDraw } from "@/app/hooks/useDraw";
import { computePointInCanvas } from "@/utils/computePoints";
import { convertToAbsolute } from "@/utils/convertToAbsolute";
import { drawLine } from "@/utils/drawLines";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, { useEffect, useState, useMemo } from "react";
import { throttle } from "lodash";

interface UserData {
  id: string;
  email?: string;
}

interface CanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  userData: UserData | null;
  roomId: string;
  tool: "default" | "pen" | "eraser";
  strokeWidth: number;
  color: string;
  isLoading: boolean;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const Canvas = ({
  canvasRef,
  userData,
  roomId,
  tool,
  strokeWidth,
  color,
  isLoading,
  socket,
}: CanvasProps) => {
  const { onMouseDown } = useDraw(createLine, canvasRef);
  const [cursorColor, setCursorColor] = useState<string>("");

  useEffect(() => {
    const randomColor = `hsl(${Math.random() * 360}, ${
      70 + Math.random() * 20
    }%, ${25 + Math.random() * 25}%)`;
    setCursorColor(randomColor);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.on("canvas-state-from-server", (state: string) => {
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      localStorage.setItem("canvasState", state);
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

    return () => {
      socket.off("draw-line");
      socket.off("canvas-state-from-server");
    };
  }, [canvasRef, isLoading, userData, roomId, socket]);

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

  // Keep this outside if you want the same throttling behavior across renders
  const throttledMouseMove = useMemo(() => {
    return throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const nativeEvent = e.nativeEvent;
      const computedCurrentPoint = computePointInCanvas(nativeEvent, canvas);

      if (!computedCurrentPoint) return;

      socket.emit("user-state", {
        userData,
        room: roomId,
        currentPoint: computedCurrentPoint,
        tool,
        cursorColor,
      });
    }, 100);
  }, [canvasRef, socket, userData, roomId, tool, cursorColor]);

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const state = canvasRef.current.toDataURL();
    socket.emit("canvas-state", { room: roomId, state });
  };
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        onMouseMove={throttledMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={saveCanvasState}
        className="w-full h-full bg-white rounded-lg cursor-none"
      />
    </div>
  );
};

export default Canvas;
