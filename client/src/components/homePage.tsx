"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToolBar } from "./ToolBar";

const socket = io("http://localhost:5000");

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseDown } = useDraw(createLine, canvasRef);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color, tool }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color, tool });
      }
    );

    return () => {
      socket.off("draw-line");
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    socket.emit("draw-line", { prevPoint, currentPoint, color, tool });
    drawLine({ prevPoint, currentPoint, ctx, color, tool });
  }

  return (
    <div className="flex relative w-full flex-col justify-center items-center gap-4 py-5">
      <ToolBar
        selectedTool={tool}
        onToolChange={setTool}
        color={color}
        onColorChange={setColor}
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
