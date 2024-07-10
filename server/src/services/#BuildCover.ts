import puppeteer, { BoundingBox } from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

import { formatParams } from "@/shared/utils";
import { env } from "@/env";

type ParamsCapture = {
  id: string;
  title: string;
  //tags: string[];
};

export async function buildCover(params: ParamsCapture) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v119.0.2/chromium-v119.0.2-pack.tar"
    ),
    headless: "new",
  });

  const page = await browser.newPage();

  const query = formatParams(params);
  const url = `${env.APP_HOST}/public/${query}`;
  
  console.log("Capture url", url);

  await page.goto(url, { waitUntil: "networkidle0" });

  // O seletor do seu div
  const selector = "#content";

  // Obtendo a área do div
  const clip: BoundingBox | null = await page.evaluate((selector: string) => {
    const element = document.querySelector(selector);
    if (!element) return null;
    const { x, y, width, height } = element.getBoundingClientRect();
    return { x, y, width, height };
  }, selector);

  if (!clip)
    throw Error(`Não consegui encontrar elemento com o seletor ${selector}.`);

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