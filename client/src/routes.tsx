import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/pages/_layouts/app";
import { NotFound } from "@/pages/NotFound";

import { AIAssistant } from "@/pages/ai-assistant";
import { Videos } from "@/pages/videos";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        path: "/",
        element: <AIAssistant />,
      },
      {
        path: "/videos",
        element: <Videos />,
      },
    ],
  },
]);
