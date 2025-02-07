import "./globals.css";

import { RouterProvider } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";

import { queryClient } from "@/shared/lib/react-query";

import { Toaster } from "@/components/ui/sonner";
import { ClientOnly } from "./components/client-only";

import { router } from "./routes";

export function App() {
  return (
    <ClientOnly>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />

        <Toaster
          position="top-right"
          expand
          closeButton={false}
          toastOptions={{
            duration: 5000,
          }}
        />
      </QueryClientProvider>
    </ClientOnly>
  );
}
