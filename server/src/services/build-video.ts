import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { readFile } from "node:fs/promises";
import path from "node:path";

import { s3 } from "@/shared/lib/aws";
import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

const exec = promisify(execCallback);

async function uploadToS3(id: string, videoBuffer: Buffer) {
  const key = `videos/video_${id}/final_video.mp4`;

  // Upload the video to S3
  await s3.send(
    new PutObjectCommand({
      Bucket: "dark-audio-generated",
      Key: key,
      Body: videoBuffer,
      ContentType: "video/mp4",
    })
  );

  // Generate a presigned URL for downloading (expires in 24 hours)
  const getCommand = new GetObjectCommand({
    Bucket: "dark-audio-generated",
    Key: key,
  });

  const downloadUrl = await getSignedUrl(s3, getCommand, { expiresIn: 86400 });

  const s3Uri = `s3://dark-audio-generated/${key}`;

  return {
    s3Uri,
    downloadUrl,
  };
}

export async function buildVideo(id: string) {
  const folderPrefix = `video_${id}`;
  const folderPath = path.join(paths.results, folderPrefix);

  const files = {
    audio: path.join(folderPath, "audio.mp3"),
    subtitle: path.join(folderPath, "captions.ass"),
    cover: path.join(folderPath, "cover.jpg"),
    finalVideo: path.join(folderPath, "final_video.mp4"),
  };

  const audioDuration = await getMediaDuration(files.audio);

  try {
    const complexFilter = `
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=5:5[blurred];
    [blurred][0:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2,trim=0:${audioDuration}[coverOverlay];
    [coverOverlay]ass='${files.subtitle
      .replace(/\\/g, "\\\\")
      .replace(":", "\\:")}',setpts=PTS+2/TB[outv];
    [1:a]adelay=2000|2000,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,aresample=async=1:first_pts=0[finalAudio]
  `.replace(/(\n)/g, "");

    const command = `
    ffmpeg -y
    -loop 1
    -i "${files.cover}"
    -i "${files.audio}"
    -filter_complex "${complexFilter.trim()}"
    -map "[outv]"
    -map "[finalAudio]"
    -vcodec libx264
    -preset ultrafast
    -acodec aac
    ${files.finalVideo}
`.replace(/(\n)/g, "");

    await exec(command);
  } catch (err) {
    console.error("Error building video:", (err as Error).message);
    throw err;
  }

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
