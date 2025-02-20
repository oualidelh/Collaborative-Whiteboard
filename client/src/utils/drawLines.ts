type DrawLineProps = Draw & {
  color: string;
  tool: string | null;
  strokeWidth: number;
};

export const drawLine = ({
  prevPoint,
  currentPoint,
  ctx,
  color,
  tool,
  strokeWidth,
}: DrawLineProps) => {
  const { x: currX, y: currY } = currentPoint;
  const lineColor = tool === "eraser" ? "#FFFFFF" : color;
  const lineWidth = strokeWidth;

  const startPoint = prevPoint ?? currentPoint;
  ctx.beginPath();
  ctx.lineWidth = lineWidth;
  ctx.strokeStyle = lineColor;
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(currX, currY);
  ctx.stroke();

  ctx.fillStyle = lineColor;
  ctx.beginPath();
  ctx.arc(currX, currY, lineWidth / 2, 0, 2 * Math.PI);
  ctx.fill();
};
