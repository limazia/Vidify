import { addVideoJob } from "@/app/queue/jobs/videoProcessingJob";
import { VideoGeneratorService } from "../interface/VideoGeneratorService";

export class VideoGeneratorServiceImpl implements VideoGeneratorService {
  async generateVideo(term: string, id: string): Promise<void> {
    try {
      console.log(`Adding video job with ID: ${id} and term: ${term}`);

      const job = await addVideoJob(id, term);
      console.log(`Job added with ID: ${job.id}`);
    } catch (error) {
      console.error("Error adding job:", error);
    }
  }
}
