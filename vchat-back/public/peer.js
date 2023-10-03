const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});
const peers = {};

myPeer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id);
});

myPeer.on("call", (call) => {
  call.answer(stream);
  const video = document.createElement("video");
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream);
  });
});
