import { useSearchParams } from "react-router-dom";
import { ArrowUpDown, List } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "./filter-search";

export function FilterBar() {
  const [searchParams, setSearchParams] = useSearchParams();

  const sortOrder = searchParams.get("sort_order") ?? "alphabetical";
  const itemsPerPage = searchParams.get("items_per_page") ?? "10";

  function handleFilter(data: { sortOrder?: string; itemsPerPage?: string }) {
    setSearchParams((prev) => {
      if (data.sortOrder) {
        prev.set("sort_order", data.sortOrder);
      }

      if (data.itemsPerPage) {
        prev.set("items_per_page", data.itemsPerPage);
      }

      prev.set("page", "1");

      return prev;
    });
  }

  const sortOrderText = {
    alphabetical: "A-Z",
    creation: "Mais novo primeiro",
  };

  const sortOrderLabel = {
    alphabetical: "Alfabética",
    creation: "Data de criação",
  } as const;

  return (
    <div className="block space-y-4">
      <SearchInput />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                {sortOrderLabel[sortOrder as keyof typeof sortOrderLabel]}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px]">
              <DropdownMenuLabel>Ordenação</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={sortOrder}
                onValueChange={(value) => handleFilter({ sortOrder: value })}
              >
                <DropdownMenuRadioItem value="alphabetical">
                  Alfabética
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="creation">
                  Data de criação
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[220px] justify-start">
                <List className="mr-2 h-4 w-4" />
                {itemsPerPage} por página
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[220px]">
              <DropdownMenuLabel>Itens por página</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup
                value={itemsPerPage}
                onValueChange={(value) => handleFilter({ itemsPerPage: value })}
              >
                <DropdownMenuRadioItem value="10">
                  10 itens
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="20">
                  20 itens
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="50">
                  50 itens
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="100">
                  100 itens
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Filtros:</span>
          <Badge variant="secondary">
            Ordem: {sortOrderText[sortOrder as keyof typeof sortOrderText]}
          </Badge>
          <Badge variant="secondary">
            Mostrando: {itemsPerPage} por página
          </Badge>
        </div>
      </div>
    </div>
  );
}