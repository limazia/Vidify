import { Response } from "express";

export interface VideoService {
  downloadVideo(id: string, response: Response): void;
  deleteVideo(id: string, response: Response): void;
}
