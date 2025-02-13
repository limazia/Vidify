import fs from "fs/promises";
import path from "node:path";

import { generateContent } from "./generate-content";
import { generateAudio } from "./generate-audio";
import { generateSubtitle } from "./generate-subtitles";
import { generateCover } from "./generate-cover";
import { buildSubtitle } from "./build-subtitle";
import { buildCover } from "./build-cover";
import { buildVideo } from "./build-video";
import { sendVideoEvent } from "./send-event";

import { Model } from "@/shared/types/model";
import { base64Encode } from "@/shared/utils";
import { paths } from "@/shared/config/paths";
import { pollyConfig } from "@/shared/config/polly";

export async function videoGenerator(id: string, prompt: string, model: Model) {
  const folderPrefix = `video_${id}`;
  const videoDir = path.join(paths.results, folderPrefix);
  const videoCover = path.join(paths.results, folderPrefix, "cover.jpg");

  console.log(`Creating directory ${videoDir}`);
  await fs.mkdir(videoDir, { recursive: true });

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

  const text = `<speak><prosody rate="fast">${content.narration.replace(
    /(')|(`)/g,
    ""
  )}</prosody></speak>`;

  console.log("Generating audio and subtitle");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Gerando áudio e legenda",
  });

  await Promise.all([
    generateAudio({ id, config: pollyConfig, text }),
    generateSubtitle({ id, config: pollyConfig, text }),
  ]);

  console.log("Building subtitle");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Construindo legenda",
  });

  await buildSubtitle(id);

  console.log("Generate cover");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Gerando capa",
  });

  const { image } = await generateCover({
    id,
    prompt: content.imagePrompt,
  });

  console.log("Building cover");
  await buildCover({
    id,
    title: content.title,
    image,
  });

  console.log("Putting all the parts of this video together");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Juntando todas as partes desse vídeo",
  });
  await buildVideo(id);

  console.log("Video generated");

  await sendVideoEvent({
    videoId: id,
    state: "finished",
    message: "Seu vídeo foi gerado",
    cover: base64Encode(videoCover),
  });

  return { id, prompt, model };
}
