import { videoQueue } from "@/app/lib/bullmq";

export async function addVideoJob(id: string, videoPath: string, settings = {}) {
  const job = await videoQueue.add(
    "process-video",
    {
      videoPath,
      outputPath: `tmp/video_${id}/final.mp4`,
      settings,
      id, 
    },
    {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 1000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  return job;
}
