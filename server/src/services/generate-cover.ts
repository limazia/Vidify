import { paths } from "@/shared/config/paths";
import { openai } from "@/shared/lib/openai";
import axios from "axios";
import fs from "fs";
import path from "path";

interface GenerateCoverParams {
  id: string;
  prompt: string;
  title: string;
}

export async function generateCover({
  id,
  prompt,
  title,
}: GenerateCoverParams) {
  if (!prompt || !title) {
    throw new Error("Prompt and title are required");
  }

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

    const folderPrefix = `video_${id}`;
    const folderPath = path.join(paths.results, folderPrefix);
    const backgroundFilePath = path.join(folderPath, "cover_background.png");
    const coverFilePath = path.join(folderPath, "cover.jpg");

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    const response = await axios.get(imageUrl, { responseType: "arraybuffer" });
    fs.writeFileSync(backgroundFilePath, response.data);

    const { data } = await axios.post("http://localhost:5001/generate", {
      id,
      title,
      image: imageUrl,
    });

    if (!data.image) {
      throw new Error("No image data received");
    }

    const base64Image = data.image.split(";base64,").pop();
    if (!base64Image) {
      throw new Error("Invalid Base64 image format");
    }

    fs.writeFileSync(coverFilePath, Buffer.from(base64Image, "base64"));

    return coverFilePath;
  } catch (err) {
    console.error("Error generating cover:", (err as Error).message);
    throw err;
  }
}
