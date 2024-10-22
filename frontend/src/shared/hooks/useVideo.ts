import { useIndexedDB } from "react-indexed-db-hook";
import { useQuery } from "@tanstack/react-query";

import { VideoProps } from "../types/Video";

export const useVideo = () => {
  const { getAll, add, update } = useIndexedDB("videos");

  async function loadVideos() {
    const videos = await getAll();

    return videos;
  }

  const { data: results, isLoading } = useQuery<VideoProps[]>({
    queryKey: ["videos"],
    refetchOnWindowFocus: false,
    queryFn: loadVideos,
  });

  return {
    results,
    isLoading,
    getAll,
    add,
    update,
  };
};
