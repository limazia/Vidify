import { Loader2, Download, CheckCircle2, XCircle } from "lucide-react";
import JsFileDownloader from "js-file-downloader";

import { VideoProps } from "@/shared/types/Video";

type CardVideoProps = {
  videoData: VideoProps;
};

export const CardVideo = ({ videoData }: CardVideoProps) => {
  const video = videoData;

  return (
    <div
      key={video.uuid}
      className="flex gap-3 border rounded-md w-full p-4 items-center"
    >
      <div>
        {video.status === "pending" ||
          (video.status === "processing" && (
            <Loader2 className="size-10 animate-spin" />
          ))}

        {video.status === "error" && (
          <XCircle className="size-10 text-red-500" />
        )}

        {video.status === "finished" && (
          <CheckCircle2 className="size-10 text-green-500" />
        )}
      </div>
      <div className="flex items-center justify-between w-full">
        <div>
          <div className="flex gap-2">
            <span className="font-bold capitalize">{video.term}</span>
          </div>
          <span>{video.status_message}</span>
        </div>
        {video.status === "finished" && (
          <button
            className="cursor-pointer"
            onClick={() => {
              new JsFileDownloader({
                url: `http://localhost:10000/api/download/${video.uuid}`,
                filename: `${video.uuid}.mp4`,
                autoStart: true,
              }).then(() => console.log("File downloaded"));
            }}
          >
            <Download className="size-8" />
          </button>
        )}
      </div>
    </div>
  );
};
