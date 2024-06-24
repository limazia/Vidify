import chromium from "chrome-aws-lambda";
import puppeteer, { BoundingBox } from "puppeteer";

import { formatParams } from "../utils/format-params";

type ParamsCapture = {
  title: string;
  //tags: string[];
};

export async function capture(params: ParamsCapture) {
  const browser = await puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: "new",
    ignoreHTTPSErrors: true,
    ignoreDefaultArgs: ["--disable-extensions"],
  });

  const page = await browser.newPage();

  const baseUrl = `http://${process.env.HOST ?? "localhost"}:${process.env.PORT ?? 2000}`;
  const query = formatParams(params);
  const url = `${baseUrl}${query}`;

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
