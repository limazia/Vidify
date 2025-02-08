import { Outlet } from "react-router-dom";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";

import { Header } from "@/components/header";
import { AnimatePresence } from "@/components/animate-presence";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col items-center py-6 bg-white">
      <div className="w-3/4">
        <Header />

        <main>
          <AnimatePresence>
            <NuqsAdapter>
              <Outlet />
            </NuqsAdapter>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
