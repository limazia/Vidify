import { api } from "@/shared/lib/axios";

export async function downloadVideo(videoId: string) {
  await api.get(`/video/${videoId}/download`);
}
