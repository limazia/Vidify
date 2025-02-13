import { exec as execCallback } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";

import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

const exec = promisify(execCallback);

export async function buildVideo(id: string): Promise<void> {
  const folderPrefix = `video_${id}`;
  const folderPath = path.join(paths.results, folderPrefix);

  const files = {
    audio: path.join(folderPath, "audio.mp3"),
    subtitle: path.join(folderPath, "captions.ass"),
    cover: path.join(folderPath, "cover.jpg"),
    finalVideo: path.join(folderPath, "final_video.mp4"),
  };

  const audioDuration = await getMediaDuration(files.audio);

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
}
