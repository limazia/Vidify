import { GenerateController } from "./controller/GenerateController";
import { VideoGeneratorServiceImpl } from "./service/VideoGeneratorServiceImpl";

export const generateController = new GenerateController(
  new VideoGeneratorServiceImpl()
);
