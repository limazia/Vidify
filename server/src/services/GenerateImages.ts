import path from "node:path";

import { resultsPath } from "@/shared/utils";
import { searchImages } from "@/shared/utils/search-images";
import { downloadImage } from "@/shared/utils/download-image";

type GenerateImage = {
  query: string;
  id: string;
};

export async function generateImages({ query, id }: GenerateImage) {
  try {
    const images = await searchImages({ query });

    if (images.length > 0) {
      const dir = path.join(resultsPath, id);

      const img = images[0];
      const imgName = "cover_background.jpg";
      const dest = `${dir}/${imgName}`;

      try {
        await downloadImage(img, dest);

        console.log(`Image downloaded: ${imgName}`);
      } catch (error) {
        console.error(`Error downloading image: ${imgName}`, error);
      }
    } else {
      console.log("No images found");
    }

    return { query, id };
  } catch (err) {
    console.error(err);
  }
}
