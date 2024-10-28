import { Router, Request, Response } from "express";

import { env } from "@/env";

import { generateController } from "@/app/modules/generate-video";
import { videoController } from "@/app/modules/video";

export const routes = Router();

 

routes.post("/api/generate", generateController.generate);
 