import { exec as execCallback } from "child_process";
import { promisify } from "util";

import { getRandomInt } from "@/shared/utils";
import { getMediaDuration, getNumberFilesFolder } from "@/shared/utils";
import { resultsPath, videosPath } from "@/shared/utils";

const exec = promisify(execCallback);

export async function buildVideo(id: string) {
  const totalSize = getNumberFilesFolder(videosPath);

  const videoBase = `${videosPath}/${getRandomInt(1, totalSize)}.mp4`;
  const audio = `${resultsPath}/${id}/audio.mp3`;
  const subtitle = `${resultsPath}/${id}/captions.ass`;
  const cover = `${resultsPath}/${id}/cover.png`;
  const outputFinalVideo = `${resultsPath}/${id}/output_final_video.mp4`;

  const audioDuration = await getMediaDuration(audio);
  const videoBaseDuration = await getMediaDuration(videoBase);

  const loopsRequired = Math.ceil(audioDuration / videoBaseDuration);

  const loopedVideoPath = `${resultsPath}/${id}/looped_video.mp4`;

  const loopCommand = `
    ffmpeg -y
    -stream_loop ${loopsRequired - 1}
    -i "${videoBase}"
    -c copy
    ${loopedVideoPath}
  `.replace(/(\n)/g, "");

  await exec(loopCommand);

  const complexFilter = `
    [0:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,trim=0:${audioDuration}[tocover];
    [tocover]boxblur=5:5[blurred];
    [blurred][2:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:enable='between(t,0,1)'[coverOverlay];
    [coverOverlay][2:v]overlay=(main_w-overlay_w)/2:(main_h-overlay_h)/2:enable='gte(t,1.1)'[vidWithImage];
    [vidWithImage]ass='${subtitle.replace(/\\/g, "\\\\").replace(":", "\\:")}',setpts=PTS+2/TB[outv];
    [1:a]adelay=2000|2000,aformat=sample_fmts=fltp:sample_rates=44100:channel_layouts=stereo,aresample=async=1:first_pts=0[finalAudio]
  `.replace(/(\n)/g, "");

  const command = `
    ffmpeg -y
    -i "${loopedVideoPath}"
    -i "${audio}"
    -i "${cover}"
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
