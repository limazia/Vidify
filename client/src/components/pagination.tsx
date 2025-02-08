import { ChevronsLeft, ChevronsRight } from "lucide-react";

import { cn } from "@/shared/utils/cn";

import { Button } from "./ui/button";

interface PaginationProps {
  pageIndex: number;
  totalCount: number;
  perPage: number;
  onPageChange: (pageIndex: number) => Promise<void> | void;
}

export function Pagination({
  pageIndex,
  totalCount,
  perPage,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(totalCount / perPage) || 1;

  function getPageNumbers() {
    const pageNumbers = [];
    const startPage = Math.max(1, pageIndex - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      pageNumbers.push("...");
    }

    return pageNumbers;
  }

  const pageNumbers = getPageNumbers();

  function handleDotsClick() {
    const nextPage = Math.min(pageIndex + 5, totalPages);
    onPageChange(nextPage);
  }

  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">
        Total de {totalCount} item(s)
      </span>

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center justify-center text-sm font-medium">
          Página {pageIndex} de {totalPages}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(1)}
            disabled={pageIndex === 1}
          >
            <span className="sr-only">Primeira página</span>
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {pageNumbers.map((page) => {
            if (typeof page === "number") {
              return (
                <Button
                  key={page}
                  variant="outline"
                  className={cn(
                    "h-8 w-8 p-0",
                    pageIndex === page
                      ? "bg-accent text-accent-foreground"
                      : "text-accent-foreground"
                  )}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </Button>
              );
            }

            return null;
          })}

          {pageNumbers[pageNumbers.length - 1] === "..." && (
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={handleDotsClick}
            >
              ...
            </Button>
          )}

          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => onPageChange(totalPages)}
            disabled={pageIndex >= totalPages}
          >
            <span className="sr-only">Última página</span>
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}