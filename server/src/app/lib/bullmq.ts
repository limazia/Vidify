import { Queue } from "bullmq";

import { redisClient } from "./redis";

const videoQueue = new Queue("video-processing", {
  connection: redisClient,
});

export { videoQueue };
