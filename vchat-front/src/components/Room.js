import React, { useCallback, useEffect, useState } from "react";
import { useSocket } from "../context/SocketProvider";
import ReactPlayer from "react-player";
import peer from "../service/peer";

function Room(props) {
  const socket = useSocket();
  const [remoteSocketId, setRemoteSocketId] = useState();
  const [myStream, setMyStream] = useState();
  const [remoteStream, setRemoteStream] = useState();
  const [video, setVideo] = useState(true);
  const [voice, setVoice] = useState(true);

  const handleUserJoined = useCallback(({ email, id }) => {
    console.log(`email:${email} joined room`);
    setRemoteSocketId(id);
  }, []);

  const handldeCallUser = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: video,
      video: voice,
    });
    const offer = await peer.getOffer();
    socket.emit("user:call", { to: remoteSocketId, offer });
    setMyStream(stream);
  }, [remoteSocketId, socket]);

  const handleIncommingCall = useCallback(
    async ({ from, offer }) => {
      setRemoteSocketId(from);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: video,
        video: voice,
      });
      setMyStream(stream);
      console.log(`incomming call from`, from, offer);
      const ans = await peer.getAnswer(offer);
      socket.emit("call:accepted", { to: from, ans });
    },
    [socket]
  );

  const sendStreams = useCallback(() => {
    for (const track of myStream.getTracks()) {
      peer.peer.addTrack(track, myStream);
    }
  }, [myStream]);

  const handleCallAccepted = useCallback(
    ({ from, ans }) => {
      peer.setLocalDescription(ans);
      console.log("call accepted");
      sendStreams();
    },
    [sendStreams]
  );

  const handleNegoNeeded = useCallback(async () => {
    const offer = await peer.getOffer();
    socket.emit("peer:nego:needed", { offer, to: remoteSocketId });
  }, [remoteSocketId, socket]);

  const handleNegoNeedIncomming = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.getAnswer(offer);
      socket.emit("peer:nego:done", { to: from, ans });
    },
    [socket]
  );

  const handleNegoNeedfinal = useCallback(async ({ ans }) => {
    await peer.setLocalDescription(ans);
  }, []);

  useEffect(() => {
    peer.peer.addEventListener("negotiationneeded", handleNegoNeeded);
    return () => {
      peer.peer.removeEventListener("negotiationneeded", handleNegoNeeded);
    };
  }, [handleNegoNeeded]);

  useEffect(() => {
    peer.peer.addEventListener("track", async (ev) => {
      const remoteStream = ev.streams;
      setRemoteStream(remoteStream[0]);
    });
  }, []);

  useEffect(() => {
    socket.on("user:joined", handleUserJoined);
    socket.on("incomming:call", handleIncommingCall);
    socket.on("call:accepted", handleCallAccepted);
    socket.on("peer:nego:needed", handleNegoNeedIncomming);
    socket.on("peer:nego:final", handleNegoNeedfinal);

    return () => {
      socket.off("user:joined", handleUserJoined);
      socket.off("incomming:call", handleUserJoined);
      socket.off("call:accepted", handleCallAccepted);
      socket.off("peer:nego:needed", handleNegoNeedIncomming);
      socket.off("peer:nego:final", handleNegoNeedfinal);
    };
  }, [
    socket,
    handleUserJoined,
    handleIncommingCall,
    handleCallAccepted,
    handleNegoNeedIncomming,
    handleNegoNeedfinal,
  ]);

  return (
    <div>
      <h1>Room</h1>
      <h4>{remoteSocketId ? "connected" : "no in the room"}</h4>
      {remoteSocketId && <button onClick={sendStreams}>send stream</button>}
      {remoteSocketId && <button onClick={handldeCallUser}>call</button>}
      {myStream && (
        <>
          <h4>My Stream</h4>
          <ReactPlayer
            playing
            muted
            style={{ height: "50px", width: "50px" }}
            url={myStream}
          />
          <button
            onClick={() => {
              console.log("pause video");
              setVideo(false);
            }}
          >
            video
          </button>
          <button
            onClick={() => {
              console.log("pause audio");
              setVoice(false);
            }}
          >
            mute
          </button>
        </>
      )}
      {remoteStream && (
        <>
          <h4>Remote Stream</h4>
          <ReactPlayer
            playing
            style={{ height: "50px", width: "50px" }}
            url={remoteStream}
          />
        </>
      )}
    </div>
  );
}

export default Room;
