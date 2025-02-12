import puppeteer, { BoundingBox } from "puppeteer";
import path from "node:path";
import fs from "node:fs";
import ejs from "ejs";
import { base64Encode } from "@/utils/base64-encode";

class CoverService {
  async generate({
    id,
    title,
    image,
  }: {
    id: string;
    title: string;
    image: string;
  }) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      const template = path.resolve(process.cwd(), "views", "cover.ejs");
      const selector = "#content";

      const folderPrefix = `video_${id}`;
      const folderPath = path.join(process.cwd(), "_temp", folderPrefix);
      const filePath = path.join(folderPath, "cover.jpg");

      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      const htmlContent = await ejs.renderFile(template, { title, image });
      await page.setContent(htmlContent);

      const clip: BoundingBox | null = await page.evaluate(
        (selector: string) => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const { x, y, width, height } = element.getBoundingClientRect();
          return { x, y, width, height };
        },
        selector
      );

      if (!clip)
        throw Error(`Could not find element with selector ${selector}.`);

      await page.evaluate(() => {
        const html = document.querySelector("html");
        const body = document.querySelector("body");

        if (html) html.style.background = "none";
        if (body) body.style.background = "none";
      });

      await page.screenshot({
        path: filePath,
        clip,
        omitBackground: true,
      });

      await browser.close();

      setTimeout(() => {
        fs.rmdirSync(folderPath, { recursive: true });

        console.log(`Deleted folder: ${folderPath}`);
      }, 1000 * 60 * 5);

      return { image: base64Encode(filePath) };
    } finally {
      await browser.close();
    }
  }
}

export const coverService = new CoverService();
