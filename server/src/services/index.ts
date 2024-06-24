import fs from "fs/promises";

import { SpeechBase } from "@/shared/types/SpeechBase";
import { getIO } from "@/shared/lib/socket";
import {
  getNumberFilesFolder,
  replaceWordsToSpeechLanguageSSML,
  resultsPath,
  videosPath,
} from "@/shared/utils";

import { buildSubtitle } from "./BuildSubtitle";
import { buildVideo } from "./BuildVideo";
import { generateAudio } from "./GenerateAudio";
import { generateContent } from "./GenerateContent";
import { generateCover } from "./GenerateCover";
import { generateSubtitle } from "./GenerateSubtitles";

export async function videoGenerator(term: string, id: string) {
  const io = getIO();

  const config: SpeechBase = {
    OutputS3BucketName: "dark-audio-generated",
    Engine: "neural",
    LanguageCode: "pt-BR",
    TextType: "ssml",
    VoiceId: "Thiago",
  };

  const totalSize = getNumberFilesFolder(videosPath);

  console.log("totalSize: ", totalSize);
  console.log("videosPath: ", videosPath);
  console.log("resultsPath: ", resultsPath);

  const dir = `${resultsPath}/${id}`;

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
    io.emit("video-status", {
      id,
      status: "error",
      status_message: "Conteúdo não gerado",
    });
    console.log("Content not generated");
    return null;
  }

  const textWithoutSSML = content.narration.replace(/(')|(`)/g, "");
  let text = `<speak><prosody rate="fast">${textWithoutSSML}</prosody></speak>`;
  text = replaceWordsToSpeechLanguageSSML(text, "en-US");

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

  console.log("Building cover");

  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Gerando capa",
  });

  await generateCover({
    id,
    title: content.title,
  });

  console.log("Putting all the parts of this video together");

  io.emit("video-status", {
    id,
    status: "processing",
    status_message: "Juntando todas as partes desse vídeo",
  });

  await buildVideo(id);

  console.log("Video generated");

  io.emit("video-status", {
    id,
    status: "finished",
    status_message: "Seu vídeo foi gerado",
  });

  return {
    id,
    term,
  };
}
