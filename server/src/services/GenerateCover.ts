import Jimp from "jimp";

import { resultsPath } from "@/shared/utils";
import { buildCover } from "./BuildCover";

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
