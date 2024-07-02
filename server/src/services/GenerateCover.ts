import axios from "axios";
import Jimp from "jimp";

import { env } from "@/env";
import { resultsPath } from "@/shared/utils";

type GenerateCover = {
  id: string;
  title: string;
};

export async function generateCover(params: GenerateCover) {
  const { id, title } = params;

  try {
    const response = await axios.get(`${env.APP_HOST}/api/cover`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: { id, title },
      responseType: "arraybuffer",
    });

    if (response.status != 200) {
      throw new Error("API call failed");
    }

    const cover = await Jimp.read(Buffer.from(response.data));

    cover.write(`${resultsPath}/${id}/cover.png`);
  } catch (error) {
    console.error(error);
  }
}
