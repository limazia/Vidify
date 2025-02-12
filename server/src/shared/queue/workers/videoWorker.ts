import { redisClient } from "@/shared/lib/redis";
import { videoGenerator } from "@/services/index_junior";
import { Logger } from "@/shared/utils/logger";
import { Worker } from "bullmq";

const logger = new Logger("videoWorker");

export const videoWorker = new Worker(
  "video-processing",
  async (job) => {
    try {
      const { title, id } = job.data;
      logger.info(`Iniciando processamento do vídeo: ${job.data.videoPath}`);

      await videoGenerator(title, id);

      return { status: "success" };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Erro no processamento: ${error.message}`);
        throw error;
      }
    }
  },
  {
    connection: redisClient,
    concurrency: 2,
  }
);

videoWorker.on("completed", (job) => {
  logger.info(`Job ${job.id} completado com sucesso`);
});

videoWorker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} falhou: ${err.message}`);
});
