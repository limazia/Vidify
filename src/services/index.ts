import { generateContent } from "./GenerateContent";

export async function videoGenerator(term: string, id: string) {
  await generateContent({ term });

  return {
    id,
    term,
  };
}
