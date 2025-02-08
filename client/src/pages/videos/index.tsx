import { useEffect } from "react";

import { socket } from "@/shared/lib/socket";
import { useVideos } from "@/shared/hooks/useVideo";
import { useFilter } from "@/shared/hooks/useFilter";

import NotFound from "@/assets/not-found.svg?react";

import { VideoSkeleton } from "./video-skeleton";
import { VideoCard } from "./video-card";
import { Pagination } from "@/components/pagination";
import { FilterBar } from "@/components/filter-bar";

export function Videos() {
  const { videos, isLoadingVideos, isErrorVideos } = useVideos();
  const { pageIndex, setPageIndex } = useFilter();

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected");
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    async function onVideoStatusEvent() {
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

  function handlePaginate(newPageIndex: number) {
    setPageIndex(newPageIndex.toString());
  }

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Videos</h1>
        <p className="text-sm text-gray-600 mb-0">Veja seus vídeos criados</p>
      </div>

      {videos && videos.data.length !== 0 && <FilterBar />}

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
            ?.map((video) => <VideoCard key={video.id} video={video} />)}
      </div>

      {videos && videos.data.length !== 0 && (
        <Pagination
          pageIndex={Number(pageIndex)}
          totalCount={videos.pagination.total}
          perPage={videos.pagination.per_page}
          onPageChange={handlePaginate}
        />
      )}

      {videos && videos?.data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <NotFound className="h-auto md:h-52" />

          <div className="flex flex-col text-center space-y-2 mt-12">
            <span className="font-bold text-xl">Nenhum video encontrado</span>

            <small className="text-gray-500">
              Crie um novo clicando no botão "Novo Video".
            </small>
          </div>
        </div>
      )}
    </div>
  );
}
