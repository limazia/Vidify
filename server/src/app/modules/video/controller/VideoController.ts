import { Request, Response } from "express";

import { VideoDTO } from "../dto/VideoDTO";
import { VideoService } from "../interface/VideoService";

export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  async download(request: Request<VideoDTO>, response: Response) {
    const { id } = request.params;

    this.videoService.downloadVideo(id, response);
  }

  async delete(request: Request<VideoDTO>, response: Response) {
    const { id } = request.params;

    this.videoService.deleteVideo(id, response);
  }
}
