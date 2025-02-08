import { Search, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useFilter } from "@/shared/hooks/useFilter";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const filterSchema = z.object({
  query: z.string().optional(),
});

type FilterSchema = z.infer<typeof filterSchema>;

export function SearchInput() {
  const { query, setQuery } = useFilter();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, reset } = useForm<FilterSchema>({
    defaultValues: {
      query: query ?? "",
    },
  });

  function handleFilter(data: { query?: string }) {
    setQuery(data.query || "");
    // Reset page to 1 when changing filters
    useFilter().setPageIndex("1");
  }

  function handleClearFilters() {
    setQuery("");
    // Reset page to 1 when clearing filters
    useFilter().setPageIndex("1");
    reset({
      query: "",
    });
  }

  const hasAnyFilter = query !== "";

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "/" && document.activeElement !== inputRef.current) {
        event.preventDefault();
        inputRef.current?.focus();
      } else if (event.key === "Escape") {
        inputRef.current?.blur();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit(handleFilter)}
      className="flex flex-col md:flex-row items-center gap-2"
    >
      <div className="relative w-full lg:w-96 group">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 px-0">
          <Search className="size-4 text-gray-400" />
        </div>

        <Input
          placeholder="Pesquise por nome ou tags..."
          className="pl-11"
          {...register("query")}
          ref={(e) => {
            inputRef.current = e;
            register("query").ref(e);
          }}
        />
      </div>

      <Button
        type="submit"
        variant="secondary"
        className="w-full md:w-auto lg:w-auto"
      >
        <Search className="size-4 mr-2" />
        Filtrar resultados
      </Button>

      {hasAnyFilter && (
        <Button
          type="button"
          variant="link"
          className="hover:no-underline text-gray-500"
          disabled={!hasAnyFilter}
          onClick={handleClearFilters}
        >
          <X className="size-4 mr-2" />
          Remover filtros
        </Button>
      )}
    </form>
  );
}
