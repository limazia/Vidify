import { api } from "@/shared/lib/axios";

export interface ILog {
  id: string;
  type: "success" | "error" | "warn" | "info";
  message: string;
  description: string;
  created_at: string;
}

export interface GetLogsResponse {
  data: {
    date: string;
    logs: ILog[];
  }[];
}

export async function getLogs(): Promise<GetLogsResponse> {
  const { data } = await api.get<GetLogsResponse>("/api/logs");

  return data;
}