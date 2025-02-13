export type VideoStatus = "pending" | "processing" | "finished" | "failed";

export interface VideoStatusData {
  id: string;
  status: "processing" | "error" | "finished";
  status_message: string;
  cover?: string;
}