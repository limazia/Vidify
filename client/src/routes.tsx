  import { createBrowserRouter } from "react-router-dom";

  import { AppLayout } from "@/pages/_layouts/app";
  import { NotFound } from "@/pages/NotFound";

  import { AIAssistant } from "@/pages/ai-assistant";
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
