import { useQueryStates } from "nuqs";

export function useFilter() {
  const [{ query, sortOrder, itemsPerPage, pageIndex }, setParams] =
    useQueryStates(
      {
        query: {
          defaultValue: "",
          parse: (value) => value || "",
        },
        sortOrder: {
          defaultValue: "alphabetical",
          parse: (value) => value || "alphabetical",
        },
        itemsPerPage: {
          defaultValue: "10",
          parse: (value) => {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? "10" : Math.max(parsed, 1).toString();
          },
        },
        pageIndex: {
          defaultValue: "1",
          parse: (value) => {
            const parsed = parseInt(value, 10);
            return isNaN(parsed) ? "1" : Math.max(parsed, 1).toString();
          },
        },
      },
      {
        history: "push",
        shallow: false,
      }
    );

  const setQuery = (newValue: string) => {
    setParams({ query: newValue });
  };
  const setSortOrder = (newValue: string) => {
    setParams({ sortOrder: newValue });
  };
  const setItemsPerPage = (newValue: string) => {
    setParams({ itemsPerPage: newValue });
  };
  const setPageIndex = (newValue: string) => {
    setParams({ pageIndex: newValue });
  };

  return {
    query,
    sortOrder,
    itemsPerPage,
    pageIndex,
    setQuery,
    setSortOrder,
    setItemsPerPage,
    setPageIndex,
  };
}
