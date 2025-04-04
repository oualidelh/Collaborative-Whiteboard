"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { getSocket } from "@/utils/socket";

const socket = getSocket();

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

  const createNewRoom = () => {
    if (!userData?.id) return;

    socket.emit("createRoom", {
      id: userData.id,
      email: userData.email,
      roomName: roomName,
    });

    socket.once("room-created", (roomId: string) => {
      console.log("Room created with ID:", roomId);
      const newRoomLink = `/room/${roomId}`;
      // navigator.clipboard.writeText(`${window.location.origin}${newRoomLink}`);
      // alert("Room link copied to clipboard!");

      // Redirect user to the created room
      router.push(newRoomLink);
    });
  };

  const joinRoom = () => {
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
            // If the room exists, emit a join-room event
            socket.emit("join-room", roomId);

            // Redirect to the room page
            router.push(`/room/${roomId}`);
          } else {
            setError("Room not found!");
          }
        });
      } else {
        setError("Invalid room ID or link.");
      }
    } catch (error) {
      setError("Please enter a valid room link or ID.");
      console.error("Error joining room:", error);
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
          <Input
            type="text"
            placeholder="Paste room link or enter ID"
            value={roomInput}
            onChange={(e) => setRoomInput(e.target.value)}
            className="border p-2 w-full"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Button
            onClick={joinRoom}
            className="w-full bg-sage-500 hover:bg-sage-600"
          >
            Join Room
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
            className="border p-2 w-full"
          />
          <Button
            onClick={createNewRoom}
            className="w-full bg-sage-500 hover:bg-sage-600"
          >
            Create New Room
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
