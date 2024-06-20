import { useEffect, useState } from "react";
import { useIndexedDB } from "react-indexed-db-hook";
import { Ghost } from "lucide-react";

import { socket } from "@/shared/lib/socket";
import { VideoProps } from "@/shared/types/Video";

import { Header } from "@/components/header";
import { CardVideo } from "./card-video";
import { FormComponent } from "./form";

type PayloadVideoStatus = {
  id: string;
  status: string;
  status_message: string;
};

export function Home() {
  const { add, getAll, update } = useIndexedDB("videos");
  const [videos, setVideos] = useState<VideoProps[]>([]);

  async function onSubmit(data: VideoProps) {
    await add(data);

    setVideos((prev) => [...prev, data]);
  }

  async function loadVideos() {
    const videos = await getAll();

    setVideos(videos);

    return videos;
  }

  useEffect(() => {
    loadVideos();
  }, []);

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

        await loadVideos();
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Header />

      <div className="w-[60%]">
        <FormComponent onSubmit={onSubmit} />
      </div>

      <div className="flex flex-col gap-2 w-[60%]">
        <p className="text-black text-md font-bold mt-10">Seus vídeos</p>

        {videos.length === 0 && (
          <div className="flex gap-3 border rounded-md w-full p-12 justify-center items-center">
            <div className="flex flex-col items-center gap-4">
              <Ghost className="size-20" />
              <span className="text-base">Nenhum vídeo encontrado</span>
            </div>
          </div>
        )}

        {videos.length > 0 && (
          <div className="flex flex-col gap-2 max-h-[320px] overflow-auto pr-[1px]">
            {videos
              .sort(
                (a, b) =>
                  a.term.charAt(0).toLowerCase().charCodeAt(0) -
                  b.term.charAt(0).toLowerCase().charCodeAt(0)
              )
              .map((video) => (
                <CardVideo key={video.uuid} videoData={video} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
