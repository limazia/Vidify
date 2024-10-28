import { server } from "@/http/server";
import { env } from "@/env";

server.listen(env.PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port :${env.PORT}`);
});
