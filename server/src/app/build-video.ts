import ffmpeg from "fluent-ffmpeg";
import path from "path";

import { getMediaDuration } from "@/shared/utils";
import { paths } from "@/shared/config/paths";

export async function buildVideo(id: string): Promise<void> {
  const audio = path.join(paths.results, `video_${id}`, "audio.mp3");
  const subtitle = path.join(paths.results, `video_${id}`, "captions.ass");
  const cover = path.join(paths.results, `video_${id}`, "cover.png");
  const finalVideo = path.join(
    paths.results,
    `video_${id}`,
    "final_video.mp4"
  );

  // Obtendo a duração do áudio
  const audioDuration = await getMediaDuration(audio);

  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(cover)
      .loop(1) // Loop da imagem de capa
      .input(audio)
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
            filename: subtitle.replace(/\\/g, "\\\\").replace(":", "\\:"),
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
      .save(finalVideo); // Salva o vídeo final
  });
}
