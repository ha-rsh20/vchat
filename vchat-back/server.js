const { Server } = require("socket.io");
const io = new Server(8080, {
  cors: true,
});
const { v4: uuidV4 } = require("uuid");

const emailToSocketMap = new Map();
const socketidToEmailMap = new Map();

io.on("connection", (socket) => {
  console.log("socket connected", socket.id);
  socket.on("room:join", (data) => {
    const { email, roomid } = data;
    emailToSocketMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomid).emit("user:joined", { email, id: socket.id });
    socket.join(roomid);
    io.to(socket.id).emit("room:join", data);
  });

  socket.on("room:create", (data) => {
    const { email, name } = data;
    const roomid = uuidV4();
    console.log(roomid);
    emailToSocketMap.set(email, socket.id);
    socketidToEmailMap.set(socket.id, email);
    io.to(roomid).emit("user:joined", { email, id: socket.id });
    socket.join(roomid);
    io.to(socket.id).emit("room:join", { email, roomid });
  });

  socket.on("user:call", ({ to, offer }) => {
    io.to(to).emit("incomming:call", { from: socket.id, offer });
  });

  socket.on("call:accepted", ({ to, ans }) => {
    io.to(to).emit("call:accepted", { from: socket.id, ans });
  });

  socket.on("peer:nego:needed", ({ to, offer }) => {
    io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
  });

  socket.on("peer:nego:done", ({ to, ans }) => {
    io.to(to).emit("peer:nego:final", { from: socket.id, ans });
  });
});
