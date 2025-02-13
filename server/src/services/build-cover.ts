import puppeteer, { BoundingBox } from "puppeteer";
import path from "node:path";
import ejs from "ejs";

import { paths } from "@/shared/config/paths";

interface BuildCoverParams {
  id: string;
  title: string;
  image: string;
}

export async function buildCover({ id, title, image }: BuildCoverParams) {
  if (!id || !title) {
    throw new Error("id and title is required");
  }

  const folderPrefix = `video_${id}`;
  const folderPath = path.join(paths.results, folderPrefix);

  const files = {
    cover: path.join(folderPath, "cover.jpg"),
    template: path.join(paths.views, "cover.ejs"),
  };

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    const selector = "#content";

    const htmlContent = await ejs.renderFile(files.template, {
      title,
      image,
    });
    await page.setContent(htmlContent);

    const clip: BoundingBox | null = await page.evaluate((selector: string) => {
      const element = document.querySelector(selector);
      if (!element) return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { x, y, width, height };
    }, selector);

    if (!clip) throw Error(`Could not find element with selector ${selector}.`);

    await page.evaluate(() => {
      const html = document.querySelector("html");
      const body = document.querySelector("body");

      if (html) html.style.background = "none";
      if (body) body.style.background = "none";
    });

    await page.screenshot({
      path: files.cover,
      clip,
      omitBackground: true,
    });

    await browser.close();
  } catch (err) {
    console.error("Error building cover:", (err as Error).message);
    throw err;
  } finally {
    await browser.close();
  }
}
