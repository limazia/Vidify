import { Router } from "express";

import { coverController } from "./core/cover/cover.controller";

export const routes = Router();

routes.get("/", coverController.preview);
routes.post("/generate", coverController.store);
