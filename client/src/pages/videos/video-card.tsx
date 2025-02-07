import { Download, Trash2 } from "lucide-react";
import JsFileDownloader from "js-file-downloader";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

import { VideoProps } from "@/shared/interfaces/Video";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { VideoStatus } from "./video-status";
import { VideoDeleteDialog } from "./video-delete-dialog";

import Placeholder from "@/assets/placeholder.svg?react";

interface VideoCardProps {
  videoData: VideoProps;
}

export function VideoCard({ videoData }: VideoCardProps) {
  const video = videoData;

  function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
  }

  return (
    <Dialog>
      <Card className="w-full rounded-md overflow-hidden shadow-md mt-3">
        <div className="relative flex items-center justify-center">
          {video.status === "finished" ? (
            <>
              {video.cover ? (
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

            <span className="text-gray-500 text-xs">
              Criado{" "}
              {formatDistanceToNow(new Date(video.created_at), {
                locale: ptBR,
                addSuffix: true,
              })}
            </span>
          </div>

          <div className="w-full flex items-center gap-2">
            <Button
              size="lg"
              disabled={video.status !== "finished"}
              className="w-full px-3 flex items-center"
              onClick={() => {
                new JsFileDownloader({
                  url: `http://localhost:10000/api/download/${video.uuid}`,
                  filename: `${video.uuid}.mp4`,
                  autoStart: true,
                }).then(() => console.log("File downloaded"));
              }}
            >
              <Download className="w-5 h-5" />
              <span className="font-base">Baixar video</span>
            </Button>

            <DialogTrigger asChild>
              <Button
                variant="link"
                disabled={video.status !== "finished"}
                className="w-full flex items-center cursor-pointer text-red-500 hover:no-underline"
                onClick={handleDeleteClick}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-base">Excluir video</span>
              </Button>
            </DialogTrigger>
          </div>
        </CardContent>
      </Card>

      <VideoDeleteDialog videoId={video.uuid} />
    </Dialog>
  );
}
