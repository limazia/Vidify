import { videoQueue } from "@/app/lib/bullmq";

export async function addVideoJob(id: string, term: string) {
  const job = await videoQueue.add(
    "process-video",
    {
      term,
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
