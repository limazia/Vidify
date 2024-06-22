import axios from "axios";
import Jimp from "jimp";
import { resolve } from "path";

import { env } from "../env";

type GenerateCover = {
  id: string;
  title: string;
};

export async function generateCover(params: GenerateCover) {
  const { id, title } = params;

  const URL = `http://${env.IMAGE_GENERATOR_HOST}:2000`;
  const dataParams = { title };

  try {
    const response = await axios.get(`${URL}/capture`, {
      headers: {
        "Content-Type": "application/json",
      },
      params: dataParams,
      responseType: "arraybuffer",
    });

    if (response.status != 200) {
      throw new Error("API call failed");
    }

    const cover = await Jimp.read(Buffer.from(response.data));

    cover.write(resolve(process.cwd(), `${env.PATH_RESULTS}/${id}/cover.png`));
  } catch (error) {
    console.error(error);
  }
}
