export interface ListParams {
  query: string;
  page: number;
  perPage: number;
  sortOrder: string;
}

interface VideoFile {
  cover_url: string;
  video_url: string;
  width: number;
  height: number;
  size: number;
  type: string;
}

interface VideoStatus {
  status: "pending" | "processing" | "completed" | "failed";
  status_message?: string;
}

interface Video {
  id: string;
  term: string;
  tags?: string[];
  file: VideoFile;
  status: VideoStatus;
  updated_at: Date;
  created_at: Date;
}

interface PaginationMeta {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface ListVideoResponse {
  data: Video[];
  pagination: PaginationMeta;
}
