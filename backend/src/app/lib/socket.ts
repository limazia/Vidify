import { env } from "@/env";
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

    socket.on("message", (data) => {
      console.log("Message received:", data);

      socket.broadcast.emit("message", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });

  io.listen(env.SOCKET_PORT);
  console.log(`🍃 Socket.IO is running on port :${env.SOCKET_PORT}`);

  return io;
}

export function getIO() {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }

  return io;
}
