"use client";
import { useDraw } from "@/app/hooks/useDraw";
import { drawLine } from "@/utils/drawLines";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { ToolBar } from "./ToolBar";
import { useDrawingHistory } from "@/app/hooks/useDrawingHistory";

const socket = io("http://localhost:5000");

const HomePage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { onMouseDown, clear } = useDraw(createLine, canvasRef);
  const { saveToHistory, undo, redo, currentStep } = useDrawingHistory(
    canvasRef,
    socket
  );
  // console.log("curntstep", currentStep);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");
  const [color, setColor] = useState("#000000");
  const [strokeWidth, setStrokeWidth] = useState(2);

  const handleUndo = () => {
    undo();
  };

  const handleRedo = () => {
    redo();
  };

  const HandleClearCanvas = () => {
    socket.emit("clear");
  };

  // useEffect(() => {
  //   const ctx = canvasRef.current?.getContext("2d");
  //   if (!ctx) return;
  // }, [currentStep]);

  useEffect(() => {
    // console.log("useEffect ran, history:", history);
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    socket.emit("client-ready");

    socket.on("get-canvas-state", () => {
      if (!canvasRef.current) return;
      console.log("Sending canvas state");
      socket.emit("canvas-state", canvasRef.current.toDataURL());
    });

    console.log("Current step:", currentStep, "Type:", typeof currentStep);

    if (currentStep === -1) {
      console.log("Fetching initial canvas state...");
      const handleCanvasState = (state: string) => {
        console.log("Received canvas state from server");
        const img = new Image();
        img.src = state;
        img.onload = () => ctx.drawImage(img, 0, 0);
      };

      socket.on("canvas-state-from-server", handleCanvasState);
      saveToHistory();

      return () => {
        socket.off("canvas-state-from-server", handleCanvasState);
      };
    }

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
      socket.off("clear");
      // socket.off("get-canvas-state");
      // socket.off("canvas-state-from-server");
    };
  }, [canvasRef, strokeWidth, clear, saveToHistory, currentStep]);

  function createLine({ prevPoint, currentPoint, ctx }: Draw) {
    // Emit and draw the line
    socket.emit("draw-line", {
      prevPoint,
      currentPoint,
      color,
      tool,
      strokeWidth,
    });
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Save only the drawn portion to history
    saveToHistory();

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
        onUndo={handleUndo}
        onRedo={handleRedo}
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
