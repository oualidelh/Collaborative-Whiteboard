import React from "react";
import { Tooltip } from "./ui/tooltip";

interface OnlineBulletProps {
  initials: string | undefined;
  tooltipText: string | string[];
  isOnline: boolean;
}

const OnlineBullets = ({
  tooltipText,
  initials,
  isOnline,
}: OnlineBulletProps) => {
  return (
    <Tooltip content={tooltipText}>
      <div
        className={`relative w-8 h-8 flex items-center justify-center rounded-full text-white text-sm font-medium
          ${isOnline ? "bg-gray-800" : "bg-gray-400"}`} // Change to grey when offline
      >
        {initials}
        <div
          className={`absolute rounded-full border-white border-solid border-2 left-0 -bottom-1 w-3 h-3
            ${isOnline ? "bg-green-500" : "bg-gray-500"}`} // Change status indicator to grey
        ></div>
      </div>
    </Tooltip>
  );
};

export default OnlineBullets;
