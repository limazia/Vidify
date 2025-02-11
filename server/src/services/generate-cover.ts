import { openai } from "@/shared/lib/openai";
import axios from "axios";

interface GenerateCoverParams {
  prompt: string;
  title: string;
}

export async function generateCover({ prompt, title }: GenerateCoverParams) {
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

    // Validate API response
    if (!result?.data?.[0]?.url) {
      throw new Error("Invalid response from image generation API");
    }

    const image = result.data[0].url;
    console.log("Generated image URL:", image);

   
    try {
      await axios.post("http://localhost:5001/generate", {
        title,
        image,
      });
    } catch (postError) {
      console.error("Failed to post cover data:", postError);
    }
 

    return image;
  } catch (error) {
    console.error("Error generating cover:", error);
    throw error;
  }
}
