import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { GenerateDTO } from "../dto/GenerateDTO";
import { VideoGeneratorService } from "../interface/VideoGeneratorService";

export class GenerateController {
  constructor(private readonly videoService: VideoGeneratorService) {}

  async generate(request: Request, response: Response) {
    const { term }: GenerateDTO = request.body;

    const id = uuid();

    this.videoService.generateVideo(term, id);

    response.status(200).json({ video_id: id });
  }
}
