import puppeteer, { BoundingBox } from "puppeteer";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import path from "node:path";
import fs from "fs/promises";
import ejs from "ejs";

import { paths } from "@/shared/config/paths";
import { s3 } from "@/shared/lib/aws";
import { env } from "@/shared/config/env";
import { connection } from "@/database";

interface BuildCoverParams {
  id: string;
  title: string;
  image: string;
}

async function uploadToS3(id: string, cover: string) {
  const keyPrefix = `videos/video_${id}/cover.jpg`;

  const fileBuffer = await fs.readFile(cover);

  await s3.send(
    new PutObjectCommand({
      Bucket: env.AWS_BUCKET,
      Key: keyPrefix,
      Body: fileBuffer,
      ContentType: "image/jpeg",
    })
  );

  const getCommand = new GetObjectCommand({
    Bucket: env.AWS_BUCKET,
    Key: keyPrefix,
  });

  const downloadUrl = await getSignedUrl(s3, getCommand, { expiresIn: 86400 });

  const permanentUrl = `https://${env.AWS_BUCKET}.s3.amazonaws.com/${keyPrefix}`;

  const s3Uri = `s3://${env.AWS_BUCKET}/${keyPrefix}`;

  return {
    s3Uri,
    downloadUrl,
    permanentUrl,
  };
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

  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

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
    browser = null;

    const result = await uploadToS3(id, files.cover);

    await connection("video_files")
      .update({
        cover_url: result.permanentUrl,
      })
      .where("video_id", id);

    console.log("Cover uploaded to S3:", result.permanentUrl);
  } catch (err) {
    console.error("Error building cover:", (err as Error).message);
    throw err;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
