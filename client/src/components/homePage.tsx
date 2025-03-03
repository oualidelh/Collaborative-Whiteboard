"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToolBar } from "./ToolBar";
import { convertToAbsolute } from "@/utils/convertToAbsolute";

const socket = io("http://localhost:5000");

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseDown, clear } = useDraw(createLine, canvasRef);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const HandleClearCanvas = () => {
    socket.emit("clear");
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current?.toDataURL()) return;
      console.log("sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    socket.on("canvas-state-from-server", (state: string) => {
      console.log("I received the state");
      const img = new Image();
      img.src = state;
      img.onload = () => {
        ctx?.drawImage(img, 0, 0);
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
        // ✅ Use the utility function to convert points
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
    };
  }, [canvasRef, strokeWidth, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      color,
      tool,
      strokeWidth,
    });

    // ✅ Use the utility function to convert points
    const { absCurrentPoint, absPrevPoint } = convertToAbsolute(
      currentPoint,
      prevPoint,
      canvas
    );

    // Draw the line locally.
    drawLine({
      prevPoint: absPrevPoint,
      currentPoint: absCurrentPoint,
      ctx,
      color,
      tool,
      strokeWidth,
    });
  }

  return (
    <div className="flex relative w-full flex-col justify-center items-center gap-4 py-5">
      <ToolBar
        selectedTool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
        strokeWidth={strokeWidth}
        onStrokeWidthChange={setStrokeWidth}
        HandleClearCanvas={HandleClearCanvas}
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
          className="w-full h-full bg-white rounded-lg"
        />
      </div>
    </div>
  );
};

export default HomePage;
