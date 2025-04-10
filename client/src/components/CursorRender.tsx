import React, { useEffect, useState } from "react";
import { Cursor } from "./Cursor";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";

interface CursorRenderProps {
  divElem: HTMLDivElement | null;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const CursorRender = ({ divElem, socket }: CursorRenderProps) => {
  const [users, setUsers] = useState<User[]>([]);

  console.log("user-cursor", users);

  useEffect(() => {
    socket.on("update-users", ({ users: newUsers }) => {
      console.log("receiving the server update userrs");
      setUsers(newUsers);
    });

    return () => {
      socket.off("update-users");
    };
  }, [socket]);
  return (
    <>
      {divElem &&
        users?.map((user) => {
          if (!user.currentPoint) return null;
          return (
            <Cursor
              key={user.userId}
              x={user.currentPoint.x * divElem.clientWidth}
              y={user.currentPoint.y * divElem.clientHeight}
              tool={user.tool}
              cursorColor={user.cursorColor}
            />
          );
        })}
    </>
  );
};

export default CursorRender;
