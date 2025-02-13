import { exec as execCallback } from "node:child_process";
import { promises as fs } from "node:fs";
import { promisify } from "node:util";
import { join } from "node:path";

const { parse, stringify } = require("ass-compiler");

import { paths } from "@/shared/config/paths";
import { Mark } from "@/shared/types/mark";

const exec = promisify(execCallback);

interface SubtitleFiles {
  marks: string;
  captions: string;
  captionsAss: string;
}

function getSubtitlePaths(id: string): SubtitleFiles {
  const folderPrefix = `video_${id}`;
  const folderPath = join(paths.results, folderPrefix);

  return {
    marks: join(folderPath, "subtitles.marks"),
    captions: join(folderPath, "captions.srt"),
    captionsAss: join(folderPath, "captions.ass"),
  };
}

async function getMarks(filePath: string): Promise<Mark[]> {
  const content = await fs.readFile(filePath, "utf8");
  return content
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line));
}

function convertTime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;
  const milliseconds = ms % 1000;

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)},${pad(
    milliseconds,
    3
  )}`;
}

function pad(num: number, size = 2): string {
  return num.toString().padStart(size, "0");
}

function createCaptions(marks: Mark[], maxTimeDiff = 2000): string {
  let captions = "";
  let startTime = convertTime(marks[0].time);
  let words = [marks[0].value];
  let captionIndex = 1;

  for (let i = 1; i < marks.length; i++) {
    const timeDiff = marks[i].time - marks[i - 1].time;
    const tempSentence = [...words, marks[i].value].join(" ");

    if (timeDiff <= maxTimeDiff && tempSentence.length < 64) {
      words.push(marks[i].value);
    } else {
      const nextStartTime = convertTime(marks[i].time);
      const endTime = marks[i - 1]
        ? convertTime(Math.min(marks[i - 1].time + 500, marks[i].time - 100))
        : convertTime(marks[i].time + 1000);

      captions += `${captionIndex++}\n${startTime} --> ${endTime}\n${formatCaption(
        words.join(" ")
      )}\n\n`;

      startTime = nextStartTime;
      words = [marks[i].value];
    }
  }

  const endTime = convertTime(marks[marks.length - 1].time + 1000);
  captions += `${captionIndex}\n${startTime} --> ${endTime}\n${formatCaption(
    words.join(" ")
  )}\n\n`;

  return captions;
}

function formatCaption(caption: string): string {
  if (caption.length <= 32) return caption;

  const lineBreakIndex = caption.indexOf(" ", 32);
  if (lineBreakIndex === -1 || lineBreakIndex > 64) return caption;

  return `${caption.slice(0, lineBreakIndex)}\n${caption.slice(
    lineBreakIndex + 1
  )}`;
}

async function styleFontAss(filePath: string): Promise<void> {
  const content = await fs.readFile(filePath, "utf8");
  const parsedASS = parse(content);

  parsedASS.styles.style[0] = {
    ...parsedASS.styles.style[0],
    Fontsize: "15",
    PrimaryColour: "&H00FFFF&",
    Italic: "1",
  };

  await fs.writeFile(filePath, stringify(parsedASS));
}

function escapePath(path: string): string {
  return `"${path}"`;
}

export async function buildSubtitle(id: string): Promise<string> {
  const files = getSubtitlePaths(id);

  try {
    const marks = await getMarks(files.marks);
    const captions = createCaptions(marks);

    await fs.writeFile(files.captions, captions);

    // Escape the file paths for FFmpeg
    const ffmpegCommand = `ffmpeg -i ${escapePath(files.captions)} ${escapePath(
      files.captionsAss
    )}`;
    await exec(ffmpegCommand);

    await styleFontAss(files.captionsAss);

    return captions;
  } catch (err) {
    console.error("Error building subtitle:", (err as Error).message);
    throw err;
  }
}
