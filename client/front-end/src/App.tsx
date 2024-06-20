import "./globals.css";

import { initDB } from "react-indexed-db-hook";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";

import { Toastify } from "@/components/toastify";

import { DBConfig } from "./shared/lib/db";
import { queryClient } from "./shared/lib/react-query";
import { router } from "./routes";

initDB(DBConfig);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toastify autoClose={5000} />
    </QueryClientProvider>
  );
}
