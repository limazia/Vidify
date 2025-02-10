import { Queue } from "bullmq";

import { redisClient } from "./redis";

const videoQueue = new Queue("video-processing", { connection: redisClient });
const audioQueue = new Queue("audio-processing", { connection: redisClient });
const subtitleQueue = new Queue("subtitle-processing", {
  connection: redisClient,
});
const imageQueue = new Queue("image-processing", { connection: redisClient });
const remotionQueue = new Queue("remotion-processing", {
  connection: redisClient,
});

export { videoQueue, audioQueue, subtitleQueue, imageQueue, remotionQueue };
