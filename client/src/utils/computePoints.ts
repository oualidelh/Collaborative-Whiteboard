export interface Point {
  x: number;
  y: number;
}

/**
 * Computes the relative position of the cursor inside the canvas.
 */
export const computePointInCanvas = (
  e: MouseEvent,
  canvas: HTMLCanvasElement | null
): Point | null => {
  if (!canvas) return null;

  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;

  return { x, y };
};
