import ffmpeg from "fluent-ffmpeg";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";
import { s3 } from "@/shared/lib/aws";

interface VideoFiles {
  audio: string;
  subtitle: string;
  cover: string;
  finalVideo: string;
}

interface VideoResult {
  s3Uri: string;
  downloadUrl: string;
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

async function uploadToS3(id: string, videoBuffer: Buffer): Promise<VideoResult> {
  const key = `videos/video_${id}/final_video.mp4`;
  
  // Upload the video to S3
  await s3.send(new PutObjectCommand({
    Bucket: "dark-audio-generated",
    Key: key,
    Body: videoBuffer,
    ContentType: "video/mp4"
  }));

  // Generate a presigned URL for downloading (expires in 24 hours)
  const getCommand = new GetObjectCommand({
    Bucket: "dark-audio-generated",
    Key: key
  });
  
  const downloadUrl = await getSignedUrl(s3, getCommand, { expiresIn: 86400 });
  
  const s3Uri = `s3://dark-audio-generated/${key}`;

  return {
    s3Uri,
    downloadUrl
  };
}

export async function buildVideo(id: string): Promise<VideoResult> {
  const { files } = getVideoPaths(id);
  const audioDuration = await getMediaDuration(files.audio);

  const videoFilters = [
    {
      filter: "scale",
      options: {
        width: 1080,
        height: 1920,
        force_original_aspect_ratio: "increase"
      }
    },
    {
      filter: "crop",
      options: {
        width: 1080,
        height: 1920
      }
    },
    {
      filter: "boxblur",
      options: "5:5"
    }
  ];

  const complexFilterString = [
    "[0:v]" + videoFilters.map(f => {
      const options = typeof f.options === "string" 
        ? f.options 
        : Object.entries(f.options).map(([k, v]) => `${k}=${v}`).join(":");
      return `${f.filter}=${options}`;
    }).join(",") + "[bg]",
    "[bg][1:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2[with_overlay]",
    `[with_overlay]ass=filename='${escapeFilePath(files.subtitle)}'[v]`
  ].join(";");

  // First, create the video
  await new Promise<void>((resolve, reject) => {
    ffmpeg()
      .input(files.cover)
      .inputOptions(["-loop 1"])
      .input(files.cover)
      .input(files.audio)
      .audioFilters([
        {
          filter: "adelay",
          options: ["2000", "2000"]
        }
      ])
      .complexFilter(complexFilterString, ["v"])
      .outputOptions([
        "-map [v]",
        "-map 2:a",
        "-t", String(audioDuration),
        "-vcodec", "libx264",
        "-preset", "ultrafast",
        "-acodec", "aac"
      ])
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

  try {
    // Read the generated video file
    const videoBuffer = await readFile(files.finalVideo);
    
    // Upload to S3 and get URLs
    const result = await uploadToS3(id, videoBuffer);
    
    console.log("Video uploaded successfully to S3");
    console.log("S3 URI:", result.s3Uri);
    console.log("Download URL:", result.downloadUrl);
    
    return result;
  } catch (err) {
    console.error("Error uploading video to S3:", (err as Error).message);
    throw err;
  }
}