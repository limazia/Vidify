import express, { Request, Response } from "express";
import { Server } from "http";
import { v4 as uuid } from "uuid";
import cors from "cors";
import fs from "node:fs";

import { videoGenerator } from "@/services";
import { initializeSocket } from "@/shared/lib/socket";
import { clientDistPath, resultsPath } from "@/shared/utils";

const app = express();
const PORT = 10000;

const httpServer = new Server(app);

initializeSocket(httpServer);

app.use(cors());
app.use(express.json());
app.use("/", express.static(clientDistPath));

app.post("/api/generate", async (req: Request, res: Response) => {
  const { term } = req.body;

  const id = uuid();

  videoGenerator(term, id);

  res.status(200).json({ video_id: id });
});

app.get("/api/download/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const videoFilePath = `${resultsPath}/${id}/output_final_video.mp4`;

  if (!fs.existsSync(videoFilePath)) {
    return res.status(404).send("Video not found");
  }

  res.setHeader("Content-Type", "video/mp4");
  res.setHeader("Content-Disposition", `attachment; filename=${id}.mp4`);

  const stream = fs.createReadStream(videoFilePath);
  stream.pipe(res);
});

app.delete("/api/delete/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  const dir = `${resultsPath}/${id}`;

  fs.rm(dir, { recursive: true, force: true }, (err) => {
    if (err) {
      return res.status(404).json({
        message: "Directory not found",
      });
    }

    console.log(`${dir} is deleted!`);
  });
});

app.get("*", (req, res) => {
  res.sendFile(clientDistPath);
});

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
