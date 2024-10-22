import { Download, Trash2 } from "lucide-react";
import JsFileDownloader from "js-file-downloader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/pt-br";

dayjs.extend(relativeTime);
dayjs.locale("pt-br");

import { VideoProps } from "@/shared/types/Video";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { VideoStatus } from "./video-status";
import { DeleteVideoDialog } from "./delete-video-dialog";

import { ReactComponent as Placeholder } from "@/assets/placeholder.svg";

type CardVideoProps = {
  videoData: VideoProps;
};

export function CardVideo({ videoData }: CardVideoProps) {
  const video = videoData;
  const formattedDate = dayjs(video.created_at).fromNow();

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  return (
    <Card className="w-full rounded-md overflow-hidden shadow-md mt-3">
      <div className="relative flex items-center justify-center">
        {video.status === "finished" ? (
          <>
            {video.cover? (
              <>
                <div
                  className="w-full h-48 object-cover bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${video.cover})`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
              </>
            ) : (
              <Placeholder className="w-full h-48 rounded-b-none" />
            )}
          </>
        ) : (
          <>
            <Skeleton className="w-full h-48 rounded-b-none" />

            <div className="absolute">
              <VideoStatus status={video.status} />
            </div>
          </>
        )}

        {video.status !== "finished" && (
          <div className="w-full absolute left-4 top-4 flex flex-col">
            <span className="font-semibold text-gray-500 text-xs uppercase">
              Na fila
            </span>
            <span className="mt-4 absolute text-gray-500 text-xs">
              {video.status_message}
            </span>
          </div>
        )}
      </div>
      <CardContent className="p-4 space-y-3">
        <div className="mt-3 space-y-2">
          <CardTitle className="text-md font-bold" title={video.uuid}>
            {video.term}
          </CardTitle>

          <span className="text-gray-500 text-xs">Criado {formattedDate}</span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            size="lg"
            disabled={video.status !== "finished"}
            className="px-3 flex items-center gap-2"
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
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="link"
                disabled={video.status !== "finished"}
                className="flex items-center gap-2 cursor-pointer text-red-500 hover:no-underline"
                onClick={handleDeleteClick}
              >
                <Trash2 className="size-5" />
                <span className="font-base">Excluir video</span>
              </Button>
            </AlertDialogTrigger>

            <DeleteVideoDialog videoId={video.uuid} />
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
}
