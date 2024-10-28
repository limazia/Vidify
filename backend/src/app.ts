import { server } from "@/http/server";
import { connection } from "@/database";
import { env } from "@/env";

connection
  .raw("SELECT 1")
  .then(async () => {
    console.log(`🌎 Environment: ${env.NODE_ENV}`);
    console.log("📦 Successfully connected to the database!");
    console.log(`🍃 Socket.IO is running on port :${env.SOCKET_PORT}`);

    server.listen(env.PORT, "0.0.0.0", () => {
      console.log(`🚀 Server is running on port :${env.PORT}`);
    });
  })
  .catch(() => {
    console.error("❌ Error connecting to the database.");
    process.exit(1);
  });
