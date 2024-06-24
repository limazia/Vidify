import { exec as execCallback } from "child_process";
import { promisify } from "util";

const exec = promisify(execCallback);

export async function getMediaDuration(filePath: string) {
  const { stdout } = await exec(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
  );

  return parseFloat(stdout.trim());
}
