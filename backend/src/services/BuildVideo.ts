import { exec as execCallback } from "child_process";
import { promisify } from "util";
import path from "path";

import { getMediaDuration } from "@/shared/utils";
import { resultsPath } from "@/shared/utils";

const exec = promisify(execCallback);

export async function buildVideo(id: string) {
  const audio = path.join(resultsPath, id, "audio.mp3");
  const subtitle = path.join(resultsPath, id, "captions.ass");
  const cover = path.join(resultsPath, id, "cover.png");
  const outputFinalVideo = path.join(resultsPath, id, "output_final_video.mp4");

  const audioDuration = await getMediaDuration(audio);

  const complexFilter = `
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=5:5[blurred];
    [blurred][0:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2,trim=0:${audioDuration}[coverOverlay];
    [coverOverlay]ass='${subtitle.replace(/\\/g, "\\\\").replace(":", "\\:")}',setpts=PTS+2/TB[outv];
    [1:a]adelay=2000|2000,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,aresample=async=1:first_pts=0[finalAudio]
  `.replace(/(\n)/g, "");

  const command = `
    ffmpeg -y
    -loop 1
    -i "${cover}"
    -i "${audio}"
    -filter_complex "${complexFilter.trim()}"
    -map "[outv]"
    -map "[finalAudio]"
    -vcodec libx264
    -preset ultrafast
    -acodec aac
    ${outputFinalVideo}
`.replace(/(\n)/g, "");

  await exec(command);
}
