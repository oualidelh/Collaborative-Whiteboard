import { getSocket } from "@/utils/socket";
import React, { useEffect, useState } from "react";
import OnlineBullets from "./OnlineBullets";
import { useUserData } from "@/app/hooks/useUserData";

const socket = getSocket();

const CanvasHeader = () => {
  const { userData } = useUserData();
  const [roomName, setRoomName] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);

  useEffect(() => {
    const handleRoomInfo = ({
      users,
      roomName,
    }: {
      users: User[];
      roomName: string;
    }) => {
      setRoomName(roomName);

      // Register users if not already stored
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
  }, []);

  return (
    <header className="flex items-center w-full px-5 my-2 justify-between">
      <h1 className="animate-slideFadeInTop text-2xl font-bold text-charcoal-700">
        {`${roomName}'s Room`}
      </h1>
      <div className="flex flex-col items-center gap-2">
        <h3 className="animate-slideFadeInRight">
          Active Users: {users.length}
        </h3>
        <div className="flex -space-x-2">
          {registeredUsers.map((user) => {
            const tooltipText =
              user.userId === userData?.id ? "You" : user.email;

            const initials = user.email.slice(0, 2).toUpperCase();

            const isOnline = users.some(
              (activeUser) => activeUser.userId === user.userId
            );

            return (
              <OnlineBullets
                key={user.userId}
                tooltipText={tooltipText}
                initials={initials}
                isOnline={isOnline} // Pass online status
              />
            );
          })}
        </div>
      </div>
    </header>
  );
};

export default CanvasHeader;
