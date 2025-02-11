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
  const config: SpeechBase = {
    OutputS3BucketName: env.AWS_BUCKET,
    Engine: "neural",
    LanguageCode: "pt-BR",
    TextType: "ssml",
    VoiceId: "Thiago",
  };
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
    generateAudio({ id, config, text }),
    generateSubtitle({ id, config, text }),
  ]);

  console.log("Building subtitle");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Construindo legenda",
  });

  await buildSubtitle(id);

  console.log("Building cover");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Gerando capa",
  });
  await generateCover({ prompt: content.imagePrompt, title: content.title });

  console.log("Putting all the parts of this video together");
  await sendVideoEvent({
    videoId: id,
    state: "processing",
    message: "Juntando todas as partes desse vídeo",
  });
  await buildVideo(id);

  console.log("Video generated");
  const cover = base64Encode(`${dir}/cover_background.jpg`);

  await sendVideoEvent({
    videoId: id,
    state: "completed",
    message: "Seu vídeo foi gerado",
    cover,
  });

  return { id, prompt, model };
}
