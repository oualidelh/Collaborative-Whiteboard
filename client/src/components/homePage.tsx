"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToolBar } from "./ToolBar";

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
    const ctx = canvasRef.current?.getContext("2d");

    socket.on(
      "draw-line",
      ({
        prevPoint,
        currentPoint,
        color,
        tool,
        strokeWidth,
      }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color, tool, strokeWidth });
      }
    );

    socket.on("clear", clear);

    return () => {
      socket.off("draw-line");
    };
  }, [canvasRef, strokeWidth, clear]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      color,
      tool,
      strokeWidth,
    });
    drawLine({ prevPoint, currentPoint, ctx, color, tool, strokeWidth });
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
      <div className="w-[750px] relative h-[750px]">
        <canvas
          ref={canvasRef}
          width={750}
          height={750}
          onMouseDown={onMouseDown}
          className="bg-white shadow-md rounded-lg"
        />
      </div>
    </div>
  );
};

export default HomePage;
