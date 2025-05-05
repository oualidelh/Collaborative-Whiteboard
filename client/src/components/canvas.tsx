import { useDraw } from "@/app/hooks/useDraw";
import { computePointInCanvas } from "@/utils/computePoints";
import { convertToAbsolute } from "@/utils/convertToAbsolute";
import { drawLine } from "@/utils/drawLines";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { throttle } from "lodash";
import CursorRender from "./CursorRender";
import { Sparkles } from "lucide-react";

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
  isLoadingImg: boolean;
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
  isLoadingImg,
}: CanvasProps) => {
  const { onMouseDown } = useDraw(createLine, canvasRef);
  const [cursorColor, setCursorColor] = useState<string>("");
  const divRef = useRef<HTMLDivElement | null>(null);

  const initializeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  useEffect(() => {
    if (!canvasRef.current) return;
    initializeCanvas();
  }, [canvasRef, initializeCanvas]);

  // Random color for the cursor
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

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("canvas state ", state);
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
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
  }, [canvasRef, isLoading, roomId, socket]);

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

  // Throttle mouse move to avoid spamming socket events
  const throttledMouseMove = useMemo(() => {
    return throttle((e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      if (!userData) return;

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
    <div
      ref={divRef}
      className="relative z-0 shadow-md rounded-lg
             w-[90vw] h-[90vw] max-w-[750px] max-h-[750px]
             sm:w-[600px] sm:h-[600px]
             md:w-[700px] md:h-[700px]
             lg:w-[750px] lg:h-[750px]"
    >
      {isLoadingImg && (
        <div className="absolute w-full h-full inset-0 bg-primary/20 bg-opacity-50 flex items-center justify-center backdrop-blur-md z-50 rounded-lg ">
          <Sparkles className=" animate-pulse text-sage-600" />
        </div>
      )}

      <canvas
        ref={canvasRef}
        width={750}
        height={750}
        onMouseMove={throttledMouseMove}
        onMouseDown={onMouseDown}
        onMouseUp={saveCanvasState}
        className="w-full h-full z-0 bg-white rounded-lg cursor-none"
      />
      <CursorRender socket={socket} divElem={divRef.current} />
    </div>
  );
};

export default Canvas;
