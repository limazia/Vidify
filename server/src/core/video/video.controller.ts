import { Request, Response } from "express";
import fs from "node:fs";

import { videoService } from "./video.service";

class VideoController {
  async index(request: Request, response: Response) {
    // #swagger.tags = ['Video']

    const {
      query = "",
      page = 1,
      per_page = 10,
      sort_order = "alphabetical",
    } = request.query;

    const videos = await videoService.list({
      query: String(query),
      page: Number(page),
      perPage: Number(per_page),
      sortOrder: String(sort_order),
    });

    response.status(200).json(videos);
  }

  async store(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { term } = request.body;

    const { id } = await videoService.generate(term);

    response.status(200).json({ id });
  }

  async delete(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { id } = request.params;

    await videoService.delete(id);

    response.status(200).send("Video deleted successfully");
  }

  async download(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { id } = request.params;

    const video = await videoService.download(id);

    response.setHeader("Content-Type", "video/mp4");
    response.setHeader("Content-Disposition", `attachment; filename=${id}.mp4`);

    const stream = fs.createReadStream(video);
    stream.pipe(response);
  }
}

export const videoController = new VideoController();
