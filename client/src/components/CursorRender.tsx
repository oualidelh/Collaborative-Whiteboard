import React, { useEffect, useState } from "react";
import { Cursor } from "./Cursor";
import { getSocket } from "@/utils/socket";

const socket = getSocket();

interface CursorRenderProps {
  divElem: HTMLDivElement | null;
}

const CursorRender = ({ divElem }: CursorRenderProps) => {
  const [users, setUsers] = useState<User[]>([]);

  console.log("usercurur", users);

  useEffect(() => {
    socket.on("update-users", (newUsers) => {
      setUsers(newUsers);
    });

    return () => {
      socket.off("update-users");
    };
  }, []);
  return (
    <>
      {divElem &&
        users.map((user) => {
          if (!user.currentPoint) return null; // Ensure currentPoint exists

          return (
            <Cursor
              key={user.userId}
              x={user.currentPoint.x * divElem.clientWidth}
              y={user.currentPoint.y * divElem.clientHeight}
              tool={user.tool}
            />
          );
        })}
    </>
  );
};

export default CursorRender;
