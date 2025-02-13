import { v4 as uuid } from "uuid";
import {  DeleteObjectsCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";
import path from "node:path";
import fs from "node:fs";

import { HttpError } from "@/http/errors/http-error";
import { paths } from "@/shared/config/paths";
import { ListParams, ListVideoResponse, Video } from "@/shared/types/video";
import { connection } from "@/database";
import { videoGenerator } from "@/services";
import { Model } from "@/shared/types/model";
import { CacheService } from "./video.cache";
import { s3 } from "@/shared/lib/aws";
import { env } from "@/shared/config/env";

interface SortOrder {
  column: string;
  direction: "asc" | "desc";
}

class VideoService {
  async list({
    query,
    page,
    perPage,
    sortOrder,
  }: ListParams): Promise<ListVideoResponse> {
    const allowedPerPageValues = [10, 20, 50, 100, 500];
    const offset = (page - 1) * perPage;

    if (!allowedPerPageValues.includes(perPage)) {
      perPage = 10;
    }

    const SORT_ORDER_MAP: Record<string, SortOrder> = {
      alphabetical: { column: "videos.created_at", direction: "asc" },
      creation: { column: "videos.created_at", direction: "desc" },
    };

    const sortOrderConfig = SORT_ORDER_MAP[sortOrder] || {
      column: "videos.created_at",
      direction: "asc",
    };

    const cacheKey = CacheService.generateCacheKey({
      query,
      page,
      perPage,
      sortOrder,
    });

    const cachedResult = await CacheService.getCache(cacheKey);

    if (cachedResult) {
      // Check if there are new videos since the last cache update
      const lastCachedVideoTime =
        cachedResult.data.length > 0
          ? new Date(cachedResult.data[cachedResult.data.length - 1].created_at)
          : new Date(0); // fallback to epoch if no videos

      const newVideosCount = await connection("videos")
        .where("created_at", ">", lastCachedVideoTime)
        .count("* as count")
        .first();

      if (Number(newVideosCount?.count) === 0) {
        // No new videos, return cached result
        return cachedResult;
      }
      // If there are new videos, proceed with a new query
    }

    // If there's no cached result or there are new videos, perform a new query
    try {
      const baseQuery = connection("videos")
        .leftJoin("video_files", "videos.id", "video_files.video_id")
        .leftJoin("video_status", "videos.id", "video_status.video_id")
        .where((builder) => {
          builder
            .where(
              connection.raw("LOWER(videos.title) LIKE ?", [
                `%${query.toLowerCase()}%`,
              ])
            )
            .orWhere(
              connection.raw("LOWER(videos.tags) LIKE ?", [
                `%${query.toLowerCase()}%`,
              ])
            );
        });

      const [total, videos] = await Promise.all([
        baseQuery.clone().count("* as total").first(),
        baseQuery
          .clone()
          .select(
            "videos.id",
            "videos.prompt",
            "videos.title",
            "videos.narration",
            "videos.tags",
            "video_files.cover_url",
            "video_files.video_url",
            "video_files.width",
            "video_files.height",
            "video_files.size",
            "video_files.type",
            "video_status.state",
            "video_status.message",
            "videos.updated_at",
            "videos.created_at"
          )
          .orderBy(sortOrderConfig.column, sortOrderConfig.direction)
          .offset(offset)
          .limit(perPage),
      ]);

      const totalCount = Number(total?.total || 0);

      const videoData: Video[] = videos.map((v) => ({
        id: v.id ? v.id : null,
        prompt: v.prompt ? v.prompt : null,
        title: v.title ? v.title : null,
        narration: v.narration ? v.narration : null,
        tags: v.tags ? v.tags.split(",").map((tag: string) => tag.trim()) : [],
        ...(v.state === "finished"
          ? {
              file: {
                cover_url: v.cover_url || null,
                video_url: v.video_url || null,
                width: v.width || null,
                height: v.height || null,
                size: v.size || null,
                type: v.type || null,
              },
            }
          : {}),
        status: {
          state: v.state,
          message: v.message || null,
        },
        updated_at: new Date(v.updated_at),
        created_at: new Date(v.created_at),
      }));

      const result = {
        data: videoData,
        pagination: {
          total: totalCount,
          per_page: Number(perPage),
          current_page: Number(page),
          total_pages: Math.ceil(totalCount / Number(perPage)),
        },
      };

      await CacheService.setCache(cacheKey, result);

      return result;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }

  async generate(prompt: string, model: Model): Promise<{ id: string }> {
    const videoId = uuid();

    try {
      await connection.transaction(async (trx) => {
        await trx("videos").insert({
          id: videoId,
          prompt,
        });

        await trx("video_files").insert({
          id: uuid(),
          video_id: videoId,
        });

        await trx("video_status").insert({
          id: uuid(),
          state: "pending",
          video_id: videoId,
        });

        await trx.commit();
        await CacheService.invalidateCache();
        await videoGenerator(videoId, prompt, model);
      });

      return {
        id: videoId,
      };
    } catch (err) {
      console.error(`Error generating video: ${(err as Error).message}`);
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    const folderPrefix = `video_${id}`;
    const folderPath = path.join(paths.results, folderPrefix);

    const video = await connection("videos").where({ id }).first();

    if (!video) {
      throw new HttpError("Nenhum item foi encontrado com este id");
    }

    try {
      const s3Prefix = `videos/video_${id}/`;
      const listObjectsCommand = {
        Bucket: env.AWS_BUCKET,
        Prefix: s3Prefix,
      };

      const listedObjects = await s3.send(
        new ListObjectsV2Command(listObjectsCommand)
      );
      const objectsToDelete =
        listedObjects.Contents?.map((obj) => ({ Key: obj.Key })) || [];

      if (objectsToDelete.length > 0) {
        const deleteObjectsCommand = new DeleteObjectsCommand({
          Bucket: env.AWS_BUCKET,
          Delete: { Objects: objectsToDelete },
        });

        await s3.send(deleteObjectsCommand);
      }

      await Promise.all([
        fs.promises.rm(folderPath, { recursive: true, force: true }),
        connection("videos").delete().where({ id }),
      ]);

      console.log(`${folderPath} and S3 folder ${s3Prefix} are deleted!`);
      await CacheService.invalidateCache();
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }

  async download(id: string): Promise<string> {
    const folderPrefix = `video_${id}`;
    const folderPath = path.join(paths.results, folderPrefix);

    const files = {
      video: path.join(folderPath, "final_video.mp4"),
    };

    try {
      await fs.promises.access(files.video);

      return files.video;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }
}

export const videoService = new VideoService();
