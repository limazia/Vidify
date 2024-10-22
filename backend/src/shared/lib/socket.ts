import { Server } from "http";
import { Server as SocketServer } from "socket.io";

let io: SocketServer;

export function initializeSocket(server: Server) {
  io = new SocketServer(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      allowedHeaders: "*",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  io.listen(4000);

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }

  return io;
}
