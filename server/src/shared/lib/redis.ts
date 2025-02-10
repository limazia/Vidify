import { Redis } from "ioredis";

import { env } from "@/shared/config/env";

const baseRedisConfig = {
  host: env.REDIS_HOST || "localhost",
  port: Number(env.REDIS_PORT) || 6379,
  maxRetriesPerRequest: null,
  retryStrategy(times: number) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  reconnectOnError(err: Error) {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
};

export const createRedisClient = () => {
  const client = new Redis(baseRedisConfig);

  client.on("connect", () => {
    console.log("🔑 Redis connected successfully!");
  });

  client.on("error", (err) => {
    console.log("🔑 Redis error encountered:", err);
  });

  client.on("end", () => {
    console.log("🔑 Redis connection closed");
  });

  // client.on("reconnecting", (ms: number) => {
  //   console.log(`🔄 Redis reconnecting in ${ms}ms...`);
  // });

  return client;
};

export const redisClient = createRedisClient();
