import Jimp from "jimp";

 
import { buildCover } from "./BuildCover";
import { resultsPath } from "@/app/config/paths";

interface GenerateCover {
  id: string;
  title: string;
}

export async function generateCover({ id, title }: GenerateCover) {
  try {
    const png = await buildCover({
      id,
      title,
    });

    const cover = await Jimp.read(Buffer.from(png));

    cover.write(`${resultsPath}/${id}/cover.png`);
  } catch (error) {
    console.error(error);
  }
}
