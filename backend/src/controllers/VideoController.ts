import { Request, Response } from "express";
import fs from "node:fs";

import { resultsPath } from "@/shared/utils";

class VideoController {
  async download(request: Request, response: Response) {
    const { id } = request.params;

    const videoFilePath = `${resultsPath}/${id}/output_final_video.mp4`;

    if (!fs.existsSync(videoFilePath)) {
      return response.status(404).send("Video not found");
    }

    response.setHeader("Content-Type", "video/mp4");
    response.setHeader("Content-Disposition", `attachment; filename=${id}.mp4`);

    const stream = fs.createReadStream(videoFilePath);
    stream.pipe(response);
  }

  async delete(request: Request, response: Response) {
    const { id } = request.params;

    const dir = `${resultsPath}/${id}`;

    fs.rm(dir, { recursive: true, force: true }, (err) => {
      if (err) {
        console.log("Directory not found");
      }

      console.log(`${dir} is deleted!`);
    });
  }
}

export const videoController = new VideoController();
