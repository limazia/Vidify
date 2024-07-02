import { Router, Request, Response } from "express";

import { clientPath } from "./shared/utils";

import { generateController } from "@/controllers/GenerateController";
import { coverController } from "@/controllers/CoverController";
import { videoController } from "@/controllers/VideoController";

export const routes = Router();

routes.get("*", (request: Request, response: Response) => response.sendFile(clientPath));

routes.post("/api/generate", generateController.generate);

routes.get("/api/cover", coverController.generate);

routes.get("/api/download/:id", videoController.download);
routes.delete("/api/delete/:id", videoController.delete);
