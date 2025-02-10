import { Jimp } from "jimp";

import { paths } from "@/shared/config/paths";

interface GenerateCover {
  id: string;
  title: string;
}

export async function generateCover({ id, title }: GenerateCover) {
  try {
    const folderPrefix = `video_${id}`;
    const png = null;

    const cover = await Jimp.read(Buffer.from(png));

    cover.write(`${paths.results}/${folderPrefix}/cover.png`);
  } catch (error) {
    console.error(error);
  }
}
