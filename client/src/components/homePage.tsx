"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseDown } = useDraw(createLine, canvasRef);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");

    socket.on(
      "draw-line",
      ({ prevPoint, currentPoint, color }: DrawLineProps) => {
        if (!ctx) return console.log("no ctx here");
        drawLine({ prevPoint, currentPoint, ctx, color });
      }
    );

    return () => {
      socket.off("draw-line");
    };
  }, [canvasRef]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    const color = "#000000";
    socket.emit("draw-line", { prevPoint, currentPoint, color });
    drawLine({ prevPoint, currentPoint, ctx, color });
  }

  return (
    <div className="flex relative w-full flex-col justify-center items-center">
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
