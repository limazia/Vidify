export type VideoStatusType = "pending" | "processing" | "error" | "finished";

export interface Video {
  id: string;
  term: string;
  content: {
    cover_url: string;
    video_url: string;
  };
  status: {
    status: VideoStatusType;
    message: string;
  };
  updated_at: Date;
  created_at: Date;
}
