import axios from "axios";

import { env } from "@/shared/config/env";

interface SearchImages {
  query: string;
  perPage?: number;
  imageSize?: "raw" | "full" | "regular" | "small" | "thumb";
}

interface UnsplashResponse {
  urls: {
    raw: string;
    full: string;
    regular: string;
    small: string;
    thumb: string;
  };
}

const api = axios.create({
  baseURL: env.UNSPLASH_API_URL,
  headers: {
    Authorization: `Client-ID ${env.UNSPLASH_ACCESS_KEY}`,
  },
});

export async function searchImages({
  query,
  perPage = 10,
  imageSize = "small",
}: SearchImages): Promise<string[]> {
  try {
    const { data } = await api.get("/search/photos", {
      params: {
        query,
        per_page: perPage,
        lang: "pt",
      },
    });

    const images = data.results.map(
      (result: UnsplashResponse) => result.urls[imageSize]
    );

    return images;
  } catch (error) {
    console.error(`Error fetching images: ${error}`);
    return [];
  }
}
