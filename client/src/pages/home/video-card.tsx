import { Download, MoreVerticalIcon, Trash2 } from "lucide-react";
import JsFileDownloader from "js-file-downloader";

import { VideoProps } from "@/shared/types/Video";
import { VideoStatus } from "./video-status";

import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DeleteVideoDialog } from "./delete-video-dialog";

type CardVideoProps = {
  videoData: VideoProps;
};

export function CardVideo({ videoData }: CardVideoProps) {
  const video = videoData;

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  return (
    <div
      key={video.uuid}
      className="w-full flex items-center gap-3 p-4 border rounded-md"
    >
      <VideoStatus status={video.status} />

      <div className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="font-bold" title={video.uuid}>
            {video.term}
          </span>

          <span className="text-sm text-gray-500">{video.status_message}</span>
        </div>

        <div className="flex items-center gap-2">
          {video.status === "finished" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <MoreVerticalIcon className="size-6 cursor-pointer" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <button
                    className="cursor-pointer flex items-center gap-2"
                    onClick={() => {
                      new JsFileDownloader({
                        url: `http://localhost:10000/api/download/${video.uuid}`,
                        filename: `${video.uuid}.mp4`,
                        autoStart: true,
                      }).then(() => console.log("File downloaded"));
                    }}
                  >
                    <Download className="size-5" />
                    <span className="font-base">Baixar video</span>
                  </button>
                </DropdownMenuItem>

                <DropdownMenuItem>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        className="cursor-pointer flex items-center gap-2"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 className="size-5 text-red-500" />
                        <span className="font-base">Excluir video</span>
                      </button>
                    </AlertDialogTrigger>

                    <DeleteVideoDialog videoId={video.uuid} />
                  </AlertDialog>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
}
