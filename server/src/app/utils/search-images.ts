import axios from "axios";

import { env } from "@/env";

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

export async function searchImages({
  query,
  perPage = 10,
  imageSize = "small",
}: SearchImages): Promise<string[]> {
  try {
    const {
      data: { results },
    } = await axios.get(env.UNSPLASH_API_URL, {
      params: {
        query,
        client_id: env.UNSPLASH_API_TOKEN,
        per_page: perPage,
      },
    });

    const images = results.map(
      (result: UnsplashResponse) => result.urls[imageSize]
    );

    return images;
  } catch (error) {
    console.error(`Error fetching images: ${error}`);
    return [];
  }
}
