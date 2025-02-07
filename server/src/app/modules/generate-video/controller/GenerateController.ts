import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { GenerateDTO } from "../dto/GenerateDTO";
import { VideoGeneratorService } from "../interface/VideoGeneratorService";
import { AppError } from "@/http/errors/app-error";

export class GenerateController {
  constructor(private readonly videoService: VideoGeneratorService) {}

  async generate(request: Request, response: Response) {
    const { term }: GenerateDTO = request.body;

    const id = uuid();

    try {
      this.videoService.generateVideo(term, id);

      response.status(200).json({ id, term });
    } catch (error) {
      //console.error("Error generating video:", error);
      throw new AppError("Internal Server Error");
    }
  }
}
