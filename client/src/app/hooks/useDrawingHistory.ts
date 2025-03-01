import { base64ToImageData } from "@/utils/imgDataConversion";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";

export const useDrawingHistory = (
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  socket: Socket
) => {
  const [history, setHistory] = useState<DrawingState[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);

  console.log("history", history);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const newState: DrawingState = { imageData };
    const newHistory = history.slice(0, currentStep + 1);
    newHistory.push(newState);
    setHistory(newHistory);
    setCurrentStep(newHistory.length - 1);
    socket.emit("savedHistory", canvas.toDataURL());
  };

  const undo = () => {
    if (currentStep <= 0) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const previousState = history[currentStep - 1];
    if (previousState?.imageData) {
      ctx.putImageData(previousState.imageData, 0, 0);
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state-undo", canvasRef.current.toDataURL());
      setCurrentStep(currentStep - 1);
    }
  };

  const redo = () => {
    if (currentStep >= history.length - 1) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const nextState = history[currentStep + 1];
    if (nextState?.imageData) {
      ctx.putImageData(nextState.imageData, 0, 0);
      if (!canvasRef.current?.toDataURL()) return;
      socket.emit("canvas-state-redo", canvasRef.current.toDataURL());
      setCurrentStep(currentStep + 1);
    }
  };

  // Only set up listeners once when component mounts
  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    socket.on("savedHistory-from-server", (state: string) => {
      console.log("Received savedHistory state from server");
      if (!ctx) {
        console.error("Canvas context is null");
        return;
      }

      base64ToImageData(state, (imageData) => {
        if (imageData) {
          const newState: DrawingState = { imageData };
          const newHistory = history.slice(0, currentStep + 1);
          newHistory.push(newState);
          setHistory(newHistory);
          setCurrentStep(newHistory.length - 1);
        } else {
          console.error("Failed to convert base64 to ImageData");
        }
      });
    });

    socket.on("canvas-state-undo-from-server", (state: string) => {
      console.log("Received undo state from server");
      if (!ctx) {
        console.error("Canvas context is null");
        return;
      }

      base64ToImageData(state, (imageData) => {
        if (imageData) {
          ctx.putImageData(imageData, 0, 0);
        } else {
          console.error("Failed to convert base64 to ImageData");
        }
      });
    });

    socket.on("canvas-state-redo-from-server", (state: string) => {
      console.log("Received redo state from server");
      if (!ctx) {
        console.error("Canvas context is null");
        return;
      }

      base64ToImageData(state, (imageData) => {
        if (imageData) {
          ctx.putImageData(imageData, 0, 0);
        } else {
          console.error("Failed to convert base64 to ImageData");
        }
      });
    });

    return () => {
      socket.off("canvas-state-undo-from-server");
      socket.off("canvas-state-redo-from-server");
    };
  }, [socket, canvasRef, currentStep, history]);

  return {
    history,
    currentStep,
    saveToHistory,
    undo,
    redo,
    setHistory,
  };
};
