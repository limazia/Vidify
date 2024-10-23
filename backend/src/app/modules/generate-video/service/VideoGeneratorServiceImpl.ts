import { VideoGeneratorService } from "../interface/VideoGeneratorService";
import { videoGenerator } from "./core";

export class VideoGeneratorServiceImpl implements VideoGeneratorService {
  generateVideo(term: string, id: string): void {
    videoGenerator(term, id);
  }
}
