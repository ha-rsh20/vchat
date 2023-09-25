import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";

function Lobby(props) {
  const [email, setEmail] = useState("");
  const [roomid, setRoomId] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();

  const onJoin = (e) => {
    e.preventDefault();
    socket.emit("room:join", { email, roomid });
  };

  const handleRoomJoin = useCallback(
    (data) => {
      const { email, roomid } = data;
      navigate(`/room/${roomid}`);
    },
    [navigate]
  );

  useEffect(() => {
    socket.on("room:join", handleRoomJoin);
    return () => {
      socket.off("room:join", handleRoomJoin);
    };
  }, [socket, handleRoomJoin]);

  return (
    <div>
      <Form onSubmit={onJoin}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>RoomId</Form.Label>
          <Form.Control
            type="number"
            placeholder="RoomId"
            value={roomid}
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
          />
        </Form.Group>

        <Button variant="dark" type="submit">
          Join
        </Button>
      </Form>
    </div>
  );
}

export default Lobby;
