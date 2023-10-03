import React, { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useSocket } from "../context/SocketProvider";
import { useNavigate } from "react-router-dom";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { TextField } from "@mui/material";

function Lobby(props) {
  const [email, setEmail] = useState("");
  const [roomid, setRoomId] = useState("");
  const [name, setName] = useState("");
  const socket = useSocket();
  const navigate = useNavigate();
  const [value, setValue] = useState("one");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    value === "one"
      ? socket.emit("room:join", { email, name, roomid })
      : socket.emit("room:create", { email, name });
  };

  const handleRoomJoin = useCallback(
    (data) => {
      
      const { email, roomid } = data;
      console.log(roomid);
      localStorage.setItem("roomid", roomid);
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
    <Form onSubmit={onSubmit}>
      <div
        style={{
          margin: "30px",
          display: "flex",
          flexDirection: "column",
          justifyItems: "center",
          alignItems: "center",
        }}
      >
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="wrapped label tabs example"
          >
            <Tab value="one" label="Join room" />
            <Tab value="two" label="Create room" />
          </Tabs>
        </Box>
        <div style={{ margin: 10 }}>
          <TextField
            id="outlined-basic"
            label="Enter email"
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
          <br />
          <br />
          <TextField
            id="outlined-basic"
            label="Enter your name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
          <br />
          <br />
          {value === "one" && (
            <>
              <TextField
                id="outlined-basic"
                label="Enter RoomID"
                variant="outlined"
                value={roomid}
                onChange={(e) => {
                  setRoomId(e.target.value);
                }}
                required
              />
              <br />
              <br />
            </>
          )}
          <Button variant="dark" type="submit">
            {value === "one" ? <>JOIN</> : <>CREATE</>}
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default Lobby;
