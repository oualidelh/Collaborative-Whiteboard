import React from "react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { Tooltip } from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { GetSocket } from "@/utils/socket";

const socket = GetSocket();

type LeaveRoomProps = {
  roomId: string;
};

const LeaveRoom = ({ roomId }: LeaveRoomProps) => {
  const router = useRouter();

  const leaveRoom = () => {
    if (!socket || !roomId) return;

    socket.emit("leave-room", roomId);

    // Redirect to the home or lobby page after leaving
    router.push("/");
  };
  return (
    <div className="animate-fadeIn fixed left-10 bottom-10">
      <Tooltip content="Leave Room">
        <Button
          variant={"default"}
          size="icon"
          onClick={leaveRoom}
          className=" w-9 h-9"
        >
          <LogOut className="h-4 w-4" />
          {/* <p className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          Log-Out
        </p> */}
        </Button>
      </Tooltip>
    </div>
  );
};

export default LeaveRoom;
