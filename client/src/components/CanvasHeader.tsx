// import { getSocket } from "@/utils/socket";
import React, { useEffect, useState, useRef } from "react";
import OnlineBullets from "./OnlineBullets";
import { useUserData } from "@/app/hooks/useUserData";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface CanvHeaderProps {
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

// const socket = getSocket();

const CanvasHeader = ({ socket }: CanvHeaderProps) => {
  const { userData } = useUserData();
  const [users, setUsers] = useState<User[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const roomNameRef = useRef<string | null>(null); // Store the room name only once

  useEffect(() => {
    const handleRoomInfo = ({
      users,
      roomName,
    }: {
      users: User[];
      roomName: string;
    }) => {
      if (!roomNameRef.current) {
        roomNameRef.current = roomName;
      }

      setRegisteredUsers((prevRegistered) => {
        const newUsers = users.filter(
          (user) => !prevRegistered.some((reg) => reg.userId === user.userId)
        );
        return [...prevRegistered, ...newUsers];
      });

      setUsers(users);
    };

    socket.on("room-info", handleRoomInfo);

    return () => {
      socket.off("room-info", handleRoomInfo);
    };
  }, [socket]);

  return (
    <header className="flex items-center flex-col md:flex-row space-y-2 w-full px-5 my-2 mt-14 justify-between">
      <div className="animate-slideFadeInTop">
        <h3 className="text-charcoal-700 font-bold">Room Name:</h3>
        <h1 className="text-xl font-bold text-charcoal-700">
          {`${roomNameRef.current || "Unknown"} Room`}
        </h1>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h3 className="animate-slideFadeInRight">
          Active Users: {users.length}
        </h3>
        <div className="flex -space-x-2">
          {registeredUsers.map((user) => {
            const tooltipText =
              user.userId === userData?.id ? "You" : user.email.split("@")[0];

            const initials = user.email.slice(0, 2).toUpperCase();

            const isOnline = users.some(
              (activeUser) => activeUser.userId === user.userId
            );

            return (
              <OnlineBullets
                key={user.userId}
                tooltipText={tooltipText}
                initials={initials}
                isOnline={isOnline}
              />
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CanvasHeader;
