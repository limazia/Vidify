import fs from "node:fs";
import { Response } from "express";

import { VideoService } from "../interface/VideoService";

import { resultsPath } from "@/app/config/paths";
import { AppError } from "@/http/errors/app-error";

export class VideoServiceImpl implements VideoService {
  downloadVideo(id: string, response: Response): void {
    const videoFilePath = `${resultsPath}/${id}/output_final_video.mp4`;

    if (!fs.existsSync(videoFilePath)) {
      throw new AppError("Video not found");
    }

    response.setHeader("Content-Type", "video/mp4");
    response.setHeader("Content-Disposition", `attachment; filename=${id}.mp4`);

    const stream = fs.createReadStream(videoFilePath);
    stream.pipe(response);
  }

  deleteVideo(id: string, response: Response): void {
    const dir = `${resultsPath}/${id}`;

    fs.rm(dir, { recursive: true, force: true }, (err) => {
      if (err) {
        response.status(500).send("Error deleting directory");
        return;
      }

      console.log(`${dir} is deleted!`);
      response.status(200).send("Video deleted successfully");
    });
  }
}
