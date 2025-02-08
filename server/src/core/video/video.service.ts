import fs from "node:fs";
import path from "node:path";
import { v4 as uuid } from "uuid";

import { HttpError } from "@/http/errors/http-error";
import { paths } from "@/shared/config/paths";
import { ListParams, ListVideoResponse, Video } from "@/shared/types/video";
import { connection } from "@/database";

class VideoService {
  async list({
    query,
    page,
    perPage,
    sortOrder,
  }: ListParams): Promise<ListVideoResponse> {
    // const cacheKey = CacheService.generateCacheKey({
    //   query,
    //   page,
    //   perPage,
    //   sortOrder,
    // });

    // const cachedResult = await CacheService.getCache(cacheKey);

    // if (cachedResult) {
    //   return cachedResult;
    // }

    try {
      const [total, videos] = await Promise.all([
        connection("videos")
          .leftJoin("video_files", "videos.id", "video_files.id_video")
          .leftJoin("videos_status", "videos.id", "videos_status.id_video")
          .where(
            connection.raw("LOWER(videos.term) LIKE ?", [
              `%${query.toLowerCase()}%`,
            ])
          )
          .orWhere(
            connection.raw("LOWER(videos.tags) LIKE ?", [
              `%${query.toLowerCase()}%`,
            ])
          )
          .count("* as total")
          .first(),
        connection("videos")
          .leftJoin("video_files", "videos.id", "video_files.id_video")
          .leftJoin("videos_status", "videos.id", "videos_status.id_video")
          .where(
            connection.raw("LOWER(videos.term) LIKE ?", [
              `%${query.toLowerCase()}%`,
            ])
          )
          .orWhere(
            connection.raw("LOWER(videos.tags) LIKE ?", [
              `%${query.toLowerCase()}%`,
            ])
          )
          .select(
            "videos.id",
            "videos.term",
            "videos.tags",
            "video_files.cover_url",
            "video_files.video_url",
            "video_files.width",
            "video_files.height",
            "video_files.size",
            "video_files.type",
            "videos_status.status",
            "videos_status.status_message",
            "videos.updated_at",
            "videos.created_at"
          )
          .orderBy("videos.created_at", sortOrder)
          .offset((page - 1) * perPage)
          .limit(perPage),
      ]);

      const totalCount = Number(total?.total || 0);

      const videoData: Video[] = videos.map((v) => ({
        id: v.id,
        term: v.term,
        tags: v.tags ? v.tags.split(",").map((tag: string) => tag.trim()) : [],
        ...(v.status === "completed"
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
          state: v.status,
          status_message: v.status_message || null,
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

      //await CacheService.setCache(cacheKey, result);

      return result;
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }

  async generate(term: string): Promise<{ id: string }> {
    const videoId = uuid();

    try {
      await connection.transaction(async (trx) => {
        await trx("videos").insert({
          id: videoId,
          term,
        });

        await trx("video_files").insert({
          id: uuid(),
          id_video: videoId,
        });

        await trx("videos_status").insert({
          id: uuid(),
          status: "pending",
          id_video: videoId,
        });

        trx.commit;

        // await CacheService.invalidateCache();
      });

      return {
        id: videoId,
      };
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }

  async delete(id: string): Promise<void> {
    const video = await connection("videos").where({ id }).first();
    const dir = path.join(paths.results, id);

    if (!video) {
      throw new HttpError("Nenhum item foi encontrado com este id");
    }

    try {
      Promise.all([
        fs.promises.rm(dir, { recursive: true, force: true }),
        connection("videos").delete().where({ id }),
      ]);

      console.log(`${dir} is deleted!`);
      //await CacheService.invalidateCache();
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }

  async download(id: string): Promise<string> {
    const videoFilePath = path.join(
      paths.results,
      id,
      "output_final_video.mp4"
    );

    try {
      await fs.promises.access(videoFilePath);

      return videoFilePath || "";
    } catch (err) {
      console.error(`Error: ${(err as Error).message}`);
      throw err;
    }
  }
}

export const videoService = new VideoService();
