import { api } from "@/shared/lib/axios";

export interface GenerateVideoRequest {
  id: string;
  term: string;
}

export async function generateVideo(payload: {
  term: string;
}): Promise<GenerateVideoRequest> {
  const { data } = await api.post("/api/generate", payload);

  return data;
}
