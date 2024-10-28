import { addVideoJob } from "@/app/queue/jobs/videoProcessingJob";
import { VideoGeneratorService } from "../interface/VideoGeneratorService";

export class VideoGeneratorServiceImpl implements VideoGeneratorService {
  async generateVideo(term: string, id: string): Promise<void> {
    try {
      const job = await addVideoJob("video.mp4", {
        quality: "high",
        format: "mp4",
      }, id); 

      console.log(`Job adicionado com ID: ${job.id}`);
    } catch (error) {
      console.error("Erro ao adicionar job:", error);
    }
  }
}
