import axios from "axios";
import fsExtra from "fs-extra";

export async function downloadImage(url: string, dir: string): Promise<void> {
  const { data } = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  return new Promise((resolve, reject) => {
    const writer = fsExtra.createWriteStream(dir);

    data.pipe(writer);
    writer.on("finish", resolve);
    writer.on("error", reject);
  });
}
