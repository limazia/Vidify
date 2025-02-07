import { api } from "@/shared/lib/axios";

export async function deleteVideo(videoId: string) {
  await api.delete(`/video/${videoId}`);
}
