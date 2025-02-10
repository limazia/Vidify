import { api } from "@/shared/lib/axios";

export interface GenerateVideoRequest {
  id: string;
  prompt: string;
  model: string;
}

export async function generateVideo(payload: {
  prompt: string;
  model: string;
}): Promise<GenerateVideoRequest> {
  const { data } = await api.post("/video", payload);

  return data;
}
