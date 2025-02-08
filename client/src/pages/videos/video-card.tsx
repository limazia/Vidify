import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, Trash2 } from "lucide-react";
import JsFileDownloader from "js-file-downloader";

import { cn } from "@/shared/utils/cn";
import { formatDate } from "@/shared/utils/format-date";
import { Video } from "@/shared/interfaces/video";

import Placeholder from "@/assets/placeholder.svg?react";

import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { VideoStatus } from "./video-status";
import { VideoDeleteDialog } from "./video-delete-dialog";

interface VideoCardProps {
  video: Video;
}

export function VideoCard({ video }: VideoCardProps) {
  const { search } = useLocation();
  const [open, setOpen] = useState(false);

  const params = new URLSearchParams(search);
  const videoId = params.get("video");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Card
        className={cn(
          "w-full rounded-md",
          videoId === video.id && "border-gray-500"
        )}
      >
        <div className="relative flex items-center justify-center rounded-md">
          {video.status.state === "finished" ? (
            video.file?.cover_url ? (
              <div
                className="relative w-full h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${video.file.cover_url})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black" />
              </div>
            ) : (
              <Placeholder className="w-full h-48 rounded-b-none" />
            )
          ) : (
            <div className="relative w-full h-48">
              <Skeleton className="w-full h-full rounded-b-none" />
              <div className="absolute inset-0 flex items-center justify-center">
                <VideoStatus status={video.status.state} />
              </div>
            </div>
          )}

          {video?.status?.state !== "finished" && (
            <div className="w-full absolute left-4 top-4 flex flex-col">
              <span className="font-semibold text-gray-500 text-xs uppercase">
                Na fila
              </span>
              <span className="mt-4 absolute text-gray-500 text-xs">
                {video?.status?.message}
              </span>
            </div>
          )}
        </div>
        <CardContent className="p-4 space-y-3">
          <div className="mt-3 space-y-2">
            <CardTitle className="text-md font-bold" title={video.id}>
              {video.term}
            </CardTitle>

            <span className="text-gray-500 text-xs">
              {formatDate(video?.created_at)}
            </span>
          </div>

          <div className="w-full flex items-center gap-2">
            <Button
              size="lg"
              disabled={video?.status?.state !== "finished"}
              className="w-full px-3 flex items-center"
              onClick={() => {
                new JsFileDownloader({
                  url: `http://localhost:4000/video/${video.id}/download`,
                  filename: `${video.id}.mp4`,
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
                disabled={video?.status?.state !== "finished"}
                className="w-full flex items-center cursor-pointer text-red-500 hover:no-underline"
                onClick={() => setOpen(true)}
              >
                <Trash2 className="w-5 h-5" />
                <span className="font-base">Excluir video</span>
              </Button>
            </DialogTrigger>
          </div>
        </CardContent>
      </Card>

      <VideoDeleteDialog videoId={video.id} onClose={setOpen} />
    </Dialog>
  );
}
