import { paths } from "@/shared/config/paths";
import { openai } from "@/shared/lib/openai";
import axios from "axios";
import fs from "fs";
import path from "path";

interface GenerateCoverParams {
  id: string;
  prompt: string;
}

export async function generateCover({ id, prompt }: GenerateCoverParams) {
  if (!id || !prompt) {
    throw new Error("id and prompt are required");
  }

  const folderPrefix = `video_${id}`;
  const folderPath = path.join(paths.results, folderPrefix);
  const backgroundFilePath = path.join(folderPath, "cover_background.jpg");

  try {
    const result = await openai.images.generate({
      prompt,
      model: "dall-e-2",
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });

    if (!result?.data?.[0]?.url) {
      throw new Error("Invalid response from image generation API");
    }

    const imageUrl = result.data[0].url;
    console.log("Generated image URL:", imageUrl);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(backgroundFilePath, response.data);

    return {
      image: imageUrl,
    };
  } catch (err) {
    console.error("Error generating cover:", (err as Error).message);
    throw err;
  }
}
