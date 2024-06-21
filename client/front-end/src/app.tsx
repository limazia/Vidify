import "./globals.css";

import { initDB } from "react-indexed-db-hook";

import { Toastify } from "@/components/toastify";
import { DBConfig } from "@/shared/lib/db";
import { Home } from "@/pages/home";

initDB(DBConfig);

export function App() {
  return (
    <>
      <Home />
      <Toastify autoClose={5000} />
    </>
  );
}
