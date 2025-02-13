import ffmpeg from "fluent-ffmpeg";
import { join } from "node:path";
import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

interface VideoFiles {
  audio: string;
  subtitle: string;
  cover: string;
  finalVideo: string;
}

function getVideoPaths(id: string): { folderPath: string; files: VideoFiles } {
  const folderPrefix = `video_${id}`;
  const folderPath = join(paths.results, folderPrefix);

  return {
    folderPath,
    files: {
      audio: join(folderPath, "audio.mp3"),
      subtitle: join(folderPath, "captions.ass"),
      cover: join(folderPath, "cover.jpg"),
      finalVideo: join(folderPath, "final_video.mp4"),
    }
  };
}

function escapeFilePath(filePath: string): string {
  return filePath.replace(/\\/g, "/").replace(/:/g, "\\:");
}

export async function buildVideo(id: string): Promise<void> {
  const { files } = getVideoPaths(id);
  const audioDuration = await getMediaDuration(files.audio);

  // Fixed video filters without 'width=' and 'height=' prefixes
  const videoFilters = [
    {
      filter: "scale",
      options: "1080:1920:force_original_aspect_ratio=increase"
    },
    {
      filter: "crop",
      options: "1080:1920"
    },
    {
      filter: "boxblur",
      options: "5:5"
    }
  ];

  // Create the complex filter string with fixed formatting
  const complexFilterString = [
    "[0:v]" + videoFilters.map(f => `${f.filter}=${f.options}`).join(",") + "[bg]",
    "[bg][1:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[with_overlay]",
    `[with_overlay]ass=filename='${escapeFilePath(files.subtitle)}'[v]`
  ].join(";");

  return new Promise((resolve, reject) => {
    ffmpeg()
      // Background (blurred cover)
      .input(files.cover)
      .inputOptions(["-loop 1"])
      // Overlay (sharp cover)
      .input(files.cover)
      // Audio track
      .input(files.audio)
      .audioFilters([
        {
          filter: "adelay",
          options: ["2000", "2000"]
        }
      ])
      // Use the fixed complex filter string
      .complexFilter(complexFilterString, ["v"])
      .outputOptions([
        "-map [v]",     // Use the video output from complex filter
        "-map 2:a",     // Use the audio from the third input (index 2)
        "-t", String(audioDuration),
        "-vcodec", "libx264",
        "-preset", "ultrafast",
        "-acodec", "aac"
      ])
      .on("start", (command: string) => {
        console.log("FFmpeg command:", command);
      })
      .on("end", () => {
        console.log("Video build completed successfully");
        resolve();
      })
      .on("error", (err: Error) => {
        console.error("Error building video:", err);
        reject(err);
      })
      .save(files.finalVideo);
  });
}