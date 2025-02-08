import { useQuery } from "@tanstack/react-query";

import { getVideos } from "@/shared/http/get-videos";
import { useFilter } from "./useFilter";

export function useVideos() {
  const { query, sortOrder, itemsPerPage, pageIndex } = useFilter();

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
