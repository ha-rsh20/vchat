import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";

function Room(props) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState();
  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`email:${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);

    return () => {
      socket.off("user:joined", handleUserJoined);
    };
  }, [socket, handleUserJoined]);

  return (
    <div>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "connected" : "no in the room"}</h4>
    </div>
  );
}

export default Room;
