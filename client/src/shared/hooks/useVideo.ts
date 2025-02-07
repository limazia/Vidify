import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";

import { getVideos } from "../http/get-videos";

export function useVideos() {
  const [searchParams, _] = useSearchParams();

  const query = searchParams.get("query") ?? "";
  const sortOrder = searchParams.get("sort_order") ?? "alphabetical";
  const itemsPerPage = z.coerce
    .number()
    .transform((per_page) => Math.max(per_page, 1))
    .parse(searchParams.get("items_per_page") ?? "10");

  const pageIndex = z.coerce
    .number()
    .transform((page) => Math.max(page, 1))
    .parse(searchParams.get("page") ?? "1");

  const {
    data: videos,
    isLoading: isLoadingVideos,
    isFetching: isFetchingVideos,
    isError: isErrorVideos,
  } = useQuery({
    queryKey: ["videos", query, pageIndex, itemsPerPage, sortOrder],
    queryFn: () =>
      getVideos({
        query,
        pageIndex,
        itemsPerPage,
        sortOrder,
      }),
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    videos,
    isLoadingVideos,
    isFetchingVideos,
    isErrorVideos,
  };
}
