export type VideoStatusType = "pending" | "processing" | "error" | "finished";

export type VideoProps = {
  uuid: string;
  term: string;
  status: VideoStatusType;
  status_message: string;
};
