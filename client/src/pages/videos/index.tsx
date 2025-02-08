import { useEffect } from "react";

import { socket } from "@/shared/lib/socket";
import { useVideos } from "@/shared/hooks/useVideo";

import NotFound from "@/assets/not-found.svg?react";

import { VideoSkeleton } from "./video-skeleton";
import { VideoCard } from "./video-card";

export function Videos() {
  const { videos, isLoadingVideos, isErrorVideos } = useVideos();

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected");
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    async function onVideoStatusEvent( ) {
      console.log("Video status event"); 
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("video:status", onVideoStatusEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("video:status", onVideoStatusEvent);
    };
  }, []);

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Videos</h1>
        <p className="text-sm text-gray-600">Veja seus vídeos criados</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoadingVideos && !videos && <VideoSkeleton />}
        {isErrorVideos && !videos && <VideoSkeleton />}

        {videos &&
          videos?.data
            ?.sort(
              (a, b) =>
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
            )
            ?.map((video) => <VideoCard key={video.id} videoData={video} />)}

        {videos && videos?.data?.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10">
            <NotFound className="h-auto md:h-52" />

            <div className="flex flex-col text-center space-y-2 mt-12">
              <span className="font-bold text-xl">
                Nenhuma empresa encontrada
              </span>

              <small className="text-gray-500">
                Crie uma empresa clicando no botão 'Nova Empresa' para adicionar
                uma nova.
              </small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
