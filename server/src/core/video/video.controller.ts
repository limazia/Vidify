import { Request, Response } from "express";
import fs from "node:fs";

import { videoService } from "./video.service";
import { HttpError } from "@/http/errors/http-error";

class VideoController {
  async index(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const {
      query = "",
      page = 1,
      per_page = 10,
      sort_order = "creation",
    } = request.query;

    try {
      const videos = await videoService.list({
        query: String(query),
        page: Number(page),
        perPage: Number(per_page),
        sortOrder: String(sort_order),
      });

      response.status(200).json(videos);
    } catch (error) {
      throw new HttpError("Failed to fetch videos", 500, "error", "video_fetch_error");
    }
  }

  async store(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { term, model } = request.body;

    try {
      const { id } = await videoService.generate(term, model);
      response.status(200).json({ id });
    } catch (error) {
      throw new HttpError("Failed to generate video", 500, "error", "video_generate_error");
    }
  }

  async delete(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { id } = request.params;

    try {
      await videoService.delete(id);
      response.status(200).json({ message: "Video deleted" });
    } catch (error) {
      throw new HttpError("Failed to delete video", 500, "error", "video_delete_error");
    }
  }

  async download(request: Request, response: Response) {
    // #swagger.tags = ['Video']
    const { id } = request.params;

    try {
      const video = await videoService.download(id);

      response.setHeader("Content-Type", "video/mp4");
      response.setHeader("Content-Disposition", `attachment; filename=${id}.mp4`);

      const stream = fs.createReadStream(video);
      stream.pipe(response);
    } catch (error) {
      throw new HttpError("Failed to download video", 500, "error", "video_download_error");
    }
  }
}

export const videoController = new VideoController();
