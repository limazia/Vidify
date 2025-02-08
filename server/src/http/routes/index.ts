import { Router, Request, Response } from "express";

import { env } from "@/shared/config/env";

import { videoController } from "@/core/video/video.controller";

export const routes = Router();

routes.get("/", (request: Request, response: Response) => {
  response.json({
    name: "Vidify",
    environment: env.NODE_ENV,
  });
});

routes.get("/videos", videoController.index);
routes.post("/video", videoController.store);
routes.get("/video/:id/download", videoController.download);
routes.delete("/video/:id", videoController.delete);
