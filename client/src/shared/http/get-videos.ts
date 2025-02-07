import { api } from "@/shared/lib/axios";

import { Video } from "../interfaces/Video";

interface IPagination {
  total: number;
  per_page: number;
  current_page: number;
  total_pages: number;
}

export interface GetVideosResponse {
  data: Video[];
  pagination: IPagination;
}

export interface GetVideosParams {
  query?: string | null;
  pageIndex?: number | null;
  itemsPerPage?: number | null;
  sortOrder?: string | null;
}

export async function getVideos({
  query = "",
  pageIndex = 1,
  itemsPerPage = 10,
  sortOrder = "alphabetical",
}: GetVideosParams) {
  const { data } = await api.get<GetVideosResponse>("/videos", {
    params: {
      query,
      page: pageIndex,
      per_page: itemsPerPage,
      sort_order: sortOrder,
    },
  });

  return data;
}
