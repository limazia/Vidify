import { Server } from "socket.io";

export function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  if (!io) {
    throw new Error("🔌 Socket.io has not been initialized!");
  }

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("🔌 User disconnected:", socket.id);
    });
  });

  return io;
}
