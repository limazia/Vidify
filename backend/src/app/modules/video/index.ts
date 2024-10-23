import { VideoController } from "./controller/VideoController";
import { VideoServiceImpl } from "./service/VideoServiceImpl";

export const videoController = new VideoController(new VideoServiceImpl());
