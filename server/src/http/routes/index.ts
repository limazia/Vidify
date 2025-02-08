import { Router, Request, Response } from "express";

import { env } from "@/env";

import { generateController } from "@/core/generate-video";
import { videoController } from "@/core/video";

export const routes = Router();

routes.get("/", (request: Request, response: Response) => {
  return response.json({
    name: "Vidify",
    environment: env.NODE_ENV,
  });
});

routes.post("/api/generate", generateController.generate);

routes.get("/api/download/:id", videoController.download);
routes.delete("/api/delete/:id", videoController.delete);
