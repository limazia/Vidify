import ffmpeg from "fluent-ffmpeg";
import path from "path";

import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

export async function buildVideo(id: string): Promise<void> {
  const folderPrefix = `video_${id}`;
  const folderPath = path.join(paths.results, folderPrefix);
  
  const files = {
    audio: path.join(folderPath, "audio.mp3"),
    subtitle: path.join(folderPath, "captions.ass"),
    cover: path.join(folderPath, "cover.jpg"),
    finalVideo: path.join(folderPath, "final_video.mp4")
  };

  // Obtendo a duração do áudio
  const audioDuration = await getMediaDuration(files.audio);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(files.cover)
      .loop(1) // Loop da imagem de capa
      .input(files.audio)
      .audioFilter(`adelay=2000|2000`) // Atraso no áudio
      .videoFilter(
        `scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,boxblur=5:5`
      ) // Filtros de vídeo
      .complexFilter([
        {
          filter: "overlay",
          options: {
            x: "(main_w-overlay_w)/2",
            y: "(main_h-overlay_h)/2",
          },
        },
        {
          filter: "ass",
          options: {
            filename: files.subtitle.replace(/\\/g, "\\\\").replace(":", "\\:"),
          },
        },
      ])
      .outputOptions([
        `-map 0:v`,
        `-map 1:a`,
        `-vcodec libx264`,
        `-preset ultrafast`,
        `-acodec aac`,
        `-t ${audioDuration}`, // Adiciona a duração do áudio como limite para o vídeo
      ])
      .on("end", () => {
        console.log("Vídeo finalizado com sucesso");
        resolve(); // Resolve a Promise quando a operação é concluída
      })
      .on("error", (err) => {
        console.error("Erro ao construir vídeo:", err);
        reject(err); // Rejeita a Promise em caso de erro
      })
      .save(files.finalVideo); // Salva o vídeo final
  });
}
