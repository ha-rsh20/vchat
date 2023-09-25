const { Server } = require("socket.io");
const io = new Server(8080, {
  cors: true,
});

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
});
