import "./globals.css";

import { initDB } from "react-indexed-db-hook";
import { QueryClientProvider } from "@tanstack/react-query";

import { DBConfig } from "@/shared/lib/db";
import { queryClient } from "@/shared/lib/react-query";

import { Toastify } from "@/components/toastify";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "@/pages/home";

initDB(DBConfig);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Home />
        <Toastify autoClose={5000} />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
