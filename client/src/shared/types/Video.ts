export type VideoStatusType = "pending" | "processing" | "error" | "finished";

export type VideoProps = {
  uuid: string;
  term: string;
  cover: string;
  status: VideoStatusType;
  status_message: string;
  created_at: string;
};
