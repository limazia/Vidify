import axios from "axios";

//import { env } from "@/env";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

if (import.meta.env.VITE_ENABLE_API_DELAY) {
  api.interceptors.request.use(async (config) => {
    await new Promise((resolve) =>
      setTimeout(resolve, Math.round(Math.random() * 4000))
    );

    return config;
  });
}
