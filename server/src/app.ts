import { server } from "@/http/server";
import { env } from "@/shared/config/env";
import { connection } from "@/database";

connection
  .raw("SELECT 1")
  .then(async () => {
    console.log(`🌎 Environment: ${env.NODE_ENV}`);
    console.log("📦 Successfully connected to the database!");
    console.log(`🍃 Socket.IO is running on port :${env.PORT}`);

    if (env.NODE_ENV === "development") {
      console.log(`📄 Access the documentation on ${env.HOST}:${env.PORT}/docs`);
    }

    // await import("@/shared/queue/workers/index.js").then(() => {
    //   console.log("🕛 Queue workers are running!");
    // });

    server.listen(env.PORT, () => {
      console.log(`🚀 Server is running on port :${env.PORT}`);
    });
  })
  .catch(() => {
    console.error("❌ Error connecting to the database.");
    process.exit(1);
  });
