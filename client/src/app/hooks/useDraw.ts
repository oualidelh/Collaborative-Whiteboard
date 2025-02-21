import { useEffect, useRef, useState } from "react";

export const useDraw = (
  onDraw: ({ ctx, currentPoint, prevPoint }: Draw) => void,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) => {
  const [mouseDown, setMouseDown] = useState(false);

  const prevPoint = useRef<null | Point>(null);

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  useEffect(() => {
    const canvas = canvasRef.current; // Store the current value
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mouseMoveHandler = (e: MouseEvent) => {
      if (!mouseDown) return;
      const currentPoint = computePointInCanvas(e);

      if (!ctx || !currentPoint) return;

      onDraw({ ctx, currentPoint, prevPoint: prevPoint.current });
      prevPoint.current = currentPoint;
    };

    const computePointInCanvas = (e: MouseEvent) => {
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
    };
    const handleMouseLeave = () => {
      prevPoint.current = null;
    };

    // ✅ Use the stored `canvas` reference
    canvas.addEventListener("mousemove", mouseMoveHandler);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    window.addEventListener("mouseup", mouseUpHandler);

    return () => {
      // ✅ Cleanup should use the stored `canvas`
      canvas.removeEventListener("mousemove", mouseMoveHandler);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw, mouseDown, canvasRef]); // ✅ Remove `canvasRef` from dependencies

  return { onMouseDown, clear };
};
