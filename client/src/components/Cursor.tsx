type Props = {
  x: number | null;
  y: number | null;
  tool: string;
  cursorColor: string;
};

export function Cursor({ x, y, tool, cursorColor }: Props) {
  if (x === null || y === null) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute z-10 top-0 left-0"
      style={{
        transform: `translateX(${x}px) translateY(${y}px)`,
      }}
    >
      {tool === "pen" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={cursorColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative -top-5 left-0"
        >
          <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
          <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
        </svg>
      )}

      {tool === "eraser" && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke={cursorColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="relative -top-5 left-0"
        >
          <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
          <path d="M22 21H7" />
          <path d="m5 11 9 9" />
        </svg>
      )}

      {tool !== "pen" && tool !== "eraser" && (
        <svg
          className="relative"
          width="38"
          height="40"
          viewBox="0 0 24 36"
          fill="none"
          stroke="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
            fill={cursorColor}
            // stroke="black"
            // strokeWidth="1"
            // strokeLinecap="round"
            // strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}
