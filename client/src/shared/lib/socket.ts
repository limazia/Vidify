import { io } from "socket.io-client";

import { env } from "@/env";

export const socket = io(env.VITE_SOCKET_URL, {
  transports: ["websocket"],
});
