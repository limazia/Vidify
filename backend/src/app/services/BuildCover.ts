import puppeteer, { BoundingBox } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";
import ejs from "ejs";
import path from "path";
import { base64Encode, resultsPath } from "@/shared/utils";

interface BuildCoverParams {
  id: string;
  title: string;
  //tags: string[];
}

export async function buildCover({ id, title }: BuildCoverParams) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar"
    ),
    headless: "new",
  });

  const templateCoverDir = path.join(
    process.cwd(),
    "src",
    "templates",
    "cover",
    "index.ejs"
  );
  const cover = path.join(resultsPath, id, "cover_background.jpg");

  const [page] = await browser.pages();
  const html = await ejs.renderFile(templateCoverDir, {
    id,
    title,
    cover: base64Encode(cover),
  });
  await page.setContent(html);

  const selector = "#content";

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

  const image = await page.screenshot({
    path: "cover.png",
    clip,
    omitBackground: true,
  });

  await browser.close();

  return image;
}
