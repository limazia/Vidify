import { Request, Response } from "express";
import { v4 as uuid } from "uuid";

import { videoGenerator } from "@/services";

class GenerateController {
  async generate(request: Request, response: Response) {
    const { term } = request.body;

    const id = uuid();

    videoGenerator(term, id);

    response.status(200).json({ video_id: id });
  }
}

export const generateController = new GenerateController();
