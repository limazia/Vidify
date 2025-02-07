import { Redis } from "ioredis";

import { env } from "@/env";

export const redisClient = new Redis(env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

redisClient.on("error", function (err) {
  console.log("Redis error encountered", err);
});

redisClient.on("end", function () {
  console.log("Redis connection closed");
});
