import "./globals.css";

import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/react-query";

import { Toastify } from "@/components/toastify";
import { TooltipProvider } from "@/components/ui/tooltip";

import { ClientOnly } from "./components/client-only";

import { router } from "./routes";
 
export function App() {
  return (
    <ClientOnly>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <RouterProvider router={router} />
          <Toastify autoClose={5000} />
        </TooltipProvider>
      </QueryClientProvider>
    </ClientOnly>
  );
}
