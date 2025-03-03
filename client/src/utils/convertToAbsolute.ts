export const convertToAbsolute = (
  currentPoint: Point,
  prevPoint: Point | null,
  canvas: HTMLCanvasElement
) => {
  return {
    absCurrentPoint: {
      x: currentPoint.x * canvas.width,
      y: currentPoint.y * canvas.height,
    },
    absPrevPoint: prevPoint
      ? {
          x: prevPoint.x * canvas.width,
          y: prevPoint.y * canvas.height,
        }
      : null,
  };
};
