import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/pages/_layouts/app";
import { NotFound } from "@/pages/NotFound";

import { AIAssistant } from "@/pages/ai-assistant";
import { Chat } from "@/pages/chat";
import { Videos } from "@/pages/videos";
import { Acknowledgements } from "@/pages/acknowledgements";

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
        path: "/chat/:id",
        element: <Chat />,
      },
      {
        path: "/videos",
        element: <Videos />,
      },
      {
        path: "/acknowledgements",
        element: <Acknowledgements />,
      },
    ],
  },
]);
