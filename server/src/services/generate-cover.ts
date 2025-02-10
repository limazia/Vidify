import { openai } from "@/shared/lib/openai";
import axios from "axios";

interface GenerateCoverParams {
  prompt: string;
  title: string;
}

export async function generateCover({ prompt, title }: GenerateCoverParams) {
  const { data } = await openai.images.generate({
    prompt,
    model: "dall-e-2",
    size: "1024x1024",
    quality: "standard",
    n: 1,
  });

  await axios.post("http://localhost:5001/cover", {
    title,
    image: data[0].url,
  });

  console.log(data[0].url);

  return data[0].url;
}
