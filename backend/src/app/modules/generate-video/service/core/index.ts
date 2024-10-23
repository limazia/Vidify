import fs from "fs/promises";
import path from "node:path";

import { buildSubtitle } from "./BuildSubtitle";
import { buildVideo } from "./BuildVideo";
import { generateAudio } from "./GenerateAudio";
import { generateContent } from "./GenerateContent";
import { generateImages } from "./GenerateImages";
import { generateCover } from "./GenerateCover";
import { generateSubtitle } from "./GenerateSubtitles";

import { SpeechBase } from "@/types/SpeechBase";
import { getIO } from "@/app/lib/socket";
import { base64Encode } from "@/app/utils";
import { resultsPath } from "@/app/config/paths";

export async function videoGenerator(term: string, id: string) {
  const io = getIO();
  const config: SpeechBase = {
    OutputS3BucketName: "dark-audio-generated",
    Engine: "neural",
    LanguageCode: "pt-BR",
    TextType: "ssml",
    VoiceId: "Thiago",
  };
  const dir = path.join(resultsPath, id);

  console.log(`Creating directory ${dir}`);
  await fs.mkdir(dir, { recursive: true });

  console.log("Generating content");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Gerando conteúdo",
  });

  const content = await generateContent({ term });
  if (!content) {
    console.log("Content not generated");
    io.emit("video-status", {
      id,
      status: "error",
      status_message: "Conteúdo não gerado",
    });
    return null;
  }

  const text = `<speak><prosody rate="fast">${content.narration.replace(
    /(')|(`)/g,
    ""
  )}</prosody></speak>`;

  console.log("Generating audio and subtitle");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Gerando áudio e legenda",
  });

  await Promise.all([
    generateAudio({ id, config, text }),
    generateSubtitle({ id, config, text }),
  ]);

  console.log("Building subtitle");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Construindo legenda",
  });
  await buildSubtitle(id);

  console.log("Downloading images");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Baixando imagens",
  });
  await generateImages({ query: content.imageQuery, id });

  console.log("Building cover");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Gerando capa",
  });
  await generateCover({ id, title: content.title });

  console.log("Putting all the parts of this video together");
  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Juntando todas as partes desse vídeo",
  });
  await buildVideo(id);

  console.log("Video generated");
  const cover = base64Encode(`${dir}/cover_background.jpg`);

  io.emit("video-status", {
    id,
    cover,
    status: "finished",
    status_message: "Seu vídeo foi gerado",
  });

  return { id, term };
}
