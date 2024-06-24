import { useEffect } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { socket } from "@/shared/lib/socket";
import { VideoProps, VideoStatusType } from "@/shared/types/Video";

import { Header } from "@/components/header";
import { CardVideo } from "./video-card";
import { FormComponent } from "./form";
import { SkeletonVideo } from "./skeleton-video";

import { ReactComponent as Background } from "@/assets/background.svg";

interface PayloadVideoStatus {
  id: string;
  status: VideoStatusType;
  status_message: string;
  created_at: string;
}

export function Home() {
  const { getAll, add, update } = useIndexedDB("videos");
  const queryClient = useQueryClient();

  async function loadVideos() {
    const videos = await getAll();

    return videos;
  }

  const { data: results, isLoading } = useQuery<VideoProps[]>({
    queryKey: ["videos"],
    refetchOnWindowFocus: false,
    queryFn: loadVideos,
  });

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected");
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    async function onVideoStatusEvent({
      id: uuid,
      status,
      status_message,
    }: PayloadVideoStatus) {
      const video = (await getAll()).find((video) => video.uuid === uuid);

      if (video) {
        await update({ ...video, uuid, status, status_message });

        queryClient.invalidateQueries({ queryKey: ["videos"] });
      }
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("video-status", onVideoStatusEvent);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("video-status", onVideoStatusEvent);
    };
  }, []);

  async function onSubmit(data: VideoProps) {
    await add(data);

    queryClient.invalidateQueries({ queryKey: ["videos"] });
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
      <div className="w-3/5">
        <Header />
      </div>

      <div className="w-3/5">
        <FormComponent onSubmit={onSubmit} />
      </div>

      <div className="flex flex-col gap-2 w-3/5">
        <p className="text-black text-md font-bold mt-10">Seus vídeos</p>
        {isLoading && !results && <SkeletonVideo />}

        {results && (
          <div className="flex flex-col gap-2 max-h-[320px] overflow-auto">
            {results
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((video) => (
                <CardVideo key={video.uuid} videoData={video} />
              ))}
          </div>
        )}

        {results && results.length === 0 && (
          <div className="flex gap-3 border rounded-md w-full p-12 justify-center items-center">
            <div className="flex flex-col items-center text-center gap-4">
              <Background className="size-48" />
              <span className="text-base font-bold">Nenhum vídeo encontrado</span>
              <small className="text-gray-400 w-80">Crie um vídeo agora mesmo digitando um <b>termo</b> e clicando em "<b>Gerar</b>" para adicionar à lista.</small>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
