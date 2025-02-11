import fs from "fs/promises";
import path from "node:path";

import { buildSubtitle } from "./build-subtitle";
import { buildVideo } from "./build-video";
import { generateAudio } from "./generate-audio";
import { generateContent } from "./generate-content";
import { generateSubtitle } from "./generate-subtitles";
import { generateCover } from "./generate-cover";
import { sendVideoEvent } from "./send-event";

import { env } from "@/shared/config/env";
import { Model } from "@/shared/types/model";
import { SpeechBase } from "@/shared/types/speech-base";
import { base64Encode } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

export async function videoGenerator(id: string, prompt: string, model: Model) {
  const dir = path.join(paths.results, `video_${id}`);

  console.log(`Creating directory ${dir}`);
  await fs.mkdir(dir, { recursive: true });

  console.log("Generating content");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Gerando conteúdo",
  });

  const content = await generateContent({ id, prompt, model });

  if (!content) {
    console.log("Content not generated");

    await sendVideoEvent({
      videoId: id,
      state: "failed",
      message: "Conteúdo não gerado",
    });

    return null;
  }

  console.log("Building cover");

  await generateCover({ id, prompt: content.imagePrompt, title: content.title });

  return { id, prompt, model };
}
