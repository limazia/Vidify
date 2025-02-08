import { useQueryState } from "nuqs";

export function useFilter() {
  const [query, setQuery] = useQueryState("query", {
    defaultValue: "",
    parse: (value) => value || "",
    history: "push",
  });

  const [sortOrder, setSortOrder] = useQueryState("sort_order", {
    defaultValue: "alphabetical",
    parse: (value) => value || "alphabetical",
    history: "push",
  });

  const [itemsPerPage, setItemsPerPage] = useQueryState("items_per_page", {
    defaultValue: "10",
    parse: (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? "10" : Math.max(parsed, 1).toString();
    },
    history: "push",
  });

  const [pageIndex, setPageIndex] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => {
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? "1" : Math.max(parsed, 1).toString();
    },
    history: "push",
  });

  return {
    query,
    setQuery,
    sortOrder,
    setSortOrder,
    itemsPerPage,
    setItemsPerPage,
    pageIndex,
    setPageIndex,
  };
}
