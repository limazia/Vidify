import { videoQueue } from "@/shared/lib/bullmq";

export async function addVideoJob(id: string, title: string) {
  const job = await videoQueue.add(
    "process-video",
    {
      title,
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
