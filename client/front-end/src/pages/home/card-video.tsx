import { Download } from "lucide-react";
import JsFileDownloader from "js-file-downloader";

import { VideoProps } from "@/shared/types/Video";
import { VideoStatus } from "./video-status";

type CardVideoProps = {
  videoData: VideoProps;
};

export const CardVideo = ({ videoData }: CardVideoProps) => {
  const video = videoData;

  return (
    <div
      key={video.uuid}
      className="w-full flex items-center gap-3 p-4 border rounded-md"
    >
      <VideoStatus status={video.status} />

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="font-bold capitalize">{video.term}</span>
          <span className="text-sm text-gray-500">{video.status_message}</span>
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
