"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { GetSocket } from "@/utils/socket";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

const socket = GetSocket();

interface HomePageProps {
  userData: {
    id: string;
    email?: string;
  } | null;
}

const HomePage = ({ userData }: HomePageProps) => {
  const router = useRouter();
  const [roomInput, setRoomInput] = useState("");
  const [roomName, setRoomName] = useState("");
  const [error, setError] = useState("");
  const [joinClicked, setJoinClicked] = useState(false);
  const [createClicked, setCreateClicked] = useState(false);

  const createNewRoom = () => {
    if (!userData?.id) return;
    setCreateClicked(true);

    const roomId = uuidv4();

    socket.emit("create-room", {
      id: userData.id,
      email: userData.email,
      roomId,
      roomName: roomName,
    });

    socket.once("room-created", () => {
      const newRoomLink = `/room/${roomId}`;
      navigator.clipboard.writeText(`${window.location.origin}${newRoomLink}`);
      toast.success("🎉Room Link Copied Successfully! 🔗Share With Friends");
      router.push(newRoomLink);
      setCreateClicked(false);
    });
  };

  const joinRoom = () => {
    setJoinClicked(true);
    setError("");
    let roomId = roomInput.trim();

    try {
      if (roomId.startsWith("http")) {
        const url = new URL(roomId);
        roomId = url.pathname.split("/").pop() || "";
      }

      if (roomId) {
        // Emit event to check if the room exists
        socket.emit("check-room", roomId);

        socket.once("room-check-result", (data) => {
          console.log("data", data);
          if (data.exists) {
            // Set a flag in sessionStorage that we're coming from the homepage
            // This will prevent the RoomPage from checking the room again
            sessionStorage.setItem("joining-from-homepage", roomId);

            // Redirect to the room page
            router.push(`/room/${roomId}`);
            setJoinClicked(false);
          } else {
            setError("Invalid room ID or link.");
            setJoinClicked(false);
          }
        });
      } else {
        setError("Field Required!");
        setJoinClicked(false);
      }
    } catch (error) {
      setError("Please enter a valid room link or ID.");
      console.error("Error joining room:", error);
      setJoinClicked(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center p-4">
      <div className="glass-card w-full max-w-md p-8 rounded-lg space-y-6">
        <h1 className="text-center text-2xl font-bold">
          Collaborative Drawing App
        </h1>

        {/* Join Room Section */}
        <div className="relative space-y-3">
          <p className="text-red-500 text-sm px-2 min-h-[20px] font-medium">
            {error || " "}
          </p>
          <Input
            type="text"
            placeholder="Paste room link or enter ID"
            value={roomInput}
            onChange={(e) => {
              setRoomInput(e.target.value);
              if (error) setError(""); // Clear error when user starts typing
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault(); // prevent default form submission if needed
                joinRoom();
              }
            }}
            className={
              error
                ? "border animate-fadeIn border-red-500 focus-visible:ring-red-500"
                : "border p-2 w-full"
            }
          />

          <Button
            onClick={joinRoom}
            className={`w-full transition-colors duration-200 ${
              joinClicked ? "bg-slate-300" : "bg-sage-500 hover:bg-sage-600"
            }`}
          >
            {joinClicked ? "Joining" : "Join Room"}
          </Button>
        </div>

        {/* Separator Line */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="text-gray-500 text-sm font-medium">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>

        {/* Create Room Section */}
        <div className="relative space-y-3">
          <Input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                createNewRoom();
              }
            }}
            className="border p-2 w-full"
          />
          <Button
            onClick={createNewRoom}
            className={`w-full transition-colors duration-200 ${
              createClicked ? "bg-slate-300" : "bg-sage-500 hover:bg-sage-600"
            }`}
          >
            {createClicked ? "Creating" : "Create Room"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
