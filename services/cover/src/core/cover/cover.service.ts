import puppeteer, { BoundingBox } from "puppeteer";
import path from "node:path";
import ejs from "ejs";

class CoverService {
  async generate({ title, image }: { title: string; image: string }) {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    try {
      const page = await browser.newPage();
      const template = path.resolve(process.cwd(), "views", "cover.ejs");
      const selector = "#content";

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

      const cover = await page.screenshot({
        path: "cover.png",
        clip,
        omitBackground: true,
      });

      await browser.close();

      return cover;
    } finally {
      await browser.close();
    }
  }
}

export const coverService = new CoverService();
