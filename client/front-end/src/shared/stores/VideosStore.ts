import { create } from "zustand";

import { VideoProps } from "../types/Video";

type VideoStore = {
  videos: VideoProps[];
  setVideos: (video: VideoProps) => void;
};

export const useVideoStore = create<VideoStore>((set) => {
  return {
    videos: [],
    setVideos: (video: VideoProps) => set((state) => ({
      videos: [...state.videos, video],
    })),
  };
});