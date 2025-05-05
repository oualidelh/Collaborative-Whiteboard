"use client";

import Image from "next/image";
import { Tooltip } from "./ui/tooltip";
import { Share2Icon } from "lucide-react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface StyleImgProps {
  styledImage: string;
  styleType: string | null;
  onClose: () => void;
  //   canvasRef: React.RefObject<HTMLCanvasElement | null>;
  //   userData: UserData | null;
  room: string;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const StyledImgModal = ({
  styledImage,
  styleType,
  onClose,
  socket,
  room,
}: StyleImgProps) => {
  const shareStyleInCanvas = () => {
    const styledState = styledImage;

    socket.emit("canvas-style-state", { styledState, room });
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-lg z-50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="group relative w-full overflow-hidden border-2 border-solid border-gray-400 rounded-md max-w-2xl lg:h-[500px] h-[90%] md:h-[85%]"
      >
        <div className="absolute top-0 w-full z-10 flex justify-between items-center p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ">
          <Tooltip content="Share With Other Members In The Room">
            <button
              className="text-slate-400 font-medium bg-white/70 p-1 rounded-sm shadow-sm"
              onClick={shareStyleInCanvas}
            >
              <Share2Icon />
            </button>
          </Tooltip>
          <p className="text-slate-400 font-medium bg-white/70 p-1 rounded-sm shadow-sm">
            {styleType}
          </p>
          <Tooltip content="Exit">
            <button
              className="text-slate-400 font-medium bg-white/70 p-1 rounded-sm shadow-sm"
              onClick={onClose}
            >
              ✖
            </button>
          </Tooltip>
        </div>

        <Image
          src={styledImage}
          alt="styledImage"
          fill
          style={{ objectFit: "cover" }}
          unoptimized
        />
      </div>
    </div>
  );
};

export default StyledImgModal;
