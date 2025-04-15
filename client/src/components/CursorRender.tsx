import { Cursor } from "./Cursor";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { useEffect, useState } from "react";

interface CursorRenderProps {
  divElem: HTMLDivElement | null;
  socket: Socket<DefaultEventsMap, DefaultEventsMap>;
}

const CursorRender = ({ divElem, socket }: CursorRenderProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    socket.on("update-users", ({ users: newUsers }) => {
      setUsers(newUsers);
    });

    return () => {
      socket.off("update-users");
    };
  }, [socket]);

  return (
    <>
      {divElem &&
        users.map((user) => {
          if (!user.currentPoint) return null;

          const width = divElem.clientWidth;
          const height = divElem.clientHeight;

          return (
            <Cursor
              key={user.userId}
              x={user.currentPoint.x * width}
              y={user.currentPoint.y * height}
              tool={user.tool}
              cursorColor={user.cursorColor}
            />
          );
        })}
    </>
  );
};

export default CursorRender;
