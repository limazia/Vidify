import { createBrowserRouter } from "react-router-dom";

import { NotFound } from "./pages/404";
import { Home } from "./pages/home";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
    //errorElement: <Navigate to="/" replace />,
  },
]);
