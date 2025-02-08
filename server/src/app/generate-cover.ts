import Jimp from "jimp";

import { buildCover } from "./build-cover";
import { paths } from "@/shared/config/paths";

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

    cover.write(`${paths.results}/${id}/cover.png`);
  } catch (error) {
    console.error(error);
  }
}
