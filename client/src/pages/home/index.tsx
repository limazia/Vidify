import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { socket } from "@/shared/lib/socket";
import { VideoProps, VideoStatusType } from "@/shared/types/Video";
import { useVideo } from "@/shared/hooks/useVideo";

import { Header } from "@/components/header";
import { CardVideo } from "./video-card";
import { FormComponent } from "./form";
import { SkeletonVideo } from "./skeleton-video";

interface PayloadVideoStatus {
  id: string;
  cover: string;
  status: VideoStatusType;
  status_message: string;
  created_at: string;
}

export function Home() {
  const { results, isLoading, add, getAll, update } = useVideo();
  const queryClient = useQueryClient();

  useEffect(() => {
    function onConnect() {
      console.log("Socket connected");
    }

    function onDisconnect() {
      console.log("Socket disconnected");
    }

    async function onVideoStatusEvent({
      id: uuid,
      cover,
      status,
      status_message,
    }: PayloadVideoStatus) {
      const video = (await getAll()).find((video) => video.uuid === uuid);

      if (video) {
        await update({ ...video, uuid, cover, status, status_message });

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
    <div className="min-h-screen flex flex-col items-center py-12">
      <div className="w-3/5">
        <Header />
      </div>

      <div className="w-3/5">
        <FormComponent onSubmit={onSubmit} />
      </div>

      <div className="flex flex-col gap-2 w-3/5 mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isLoading && !results && <SkeletonVideo />}

          {results &&
            results
              .sort(
                (a, b) =>
                  new Date(b.created_at).getTime() -
                  new Date(a.created_at).getTime()
              )
              .map((video) => <CardVideo key={video.uuid} videoData={video} />)}

          {results && results.length === 0 && <div />}
        </div>
      </div>
    </div>
  );
}
