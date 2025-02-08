import fs from "node:fs";
import path from "node:path";

import { HttpError } from "@/http/errors/http-error";
import { paths } from "@/app/config/paths";
import { ListParams, ListVideoResponse } from "@/types/video";
import { connection } from "@/database";

class VideoService {
  async list({
    query,
    page,
    perPage,
    sortOrder,
  }: ListParams): Promise<ListVideoResponse> {
    const offset = (page - 1) * perPage;

    const baseQuery = connection("videos as v")
      .leftJoin("video_files as vf", "v.id", "vf.id_video")
      .leftJoin("videos_status as vs", "v.id", "vs.id_video")
      .where((builder) => {
        if (query) {
          builder
            .where("v.term", "ilike", `%${query}%`)
            .orWhere("v.tags", "ilike", `%${query}%`);
        }
      });

    // Get total count for pagination
    const [{ count }] = await baseQuery.clone().count();

    // Get paginated results with all related data
    const results = await baseQuery
      .select([
        // Video fields
        "v.id as video_id",
        "v.term",
        "v.cover",
        "v.tags",
        "v.updated_at as video_updated_at",
        "v.created_at as video_created_at",
        // Video files fields
        "vf.id as file_id",
        "vf.cover_url",
        "vf.video_url",
        "vf.width",
        "vf.height",
        "vf.size",
        "vf.type",
        // Video status fields
        "vs.id as status_id",
        "vs.status",
        "vs.status_message",
      ])
      .orderBy(
        (() => {
          switch (sortOrder) {
            case "newest":
              return "v.created_at";
            case "oldest":
              return "v.created_at";
            default:
              return "v.term";
          }
        })(),
        sortOrder === "oldest" ? "asc" : "desc"
      )
      .limit(perPage)
      .offset(offset);

    // Group and transform the results
    const videos = results.reduce<Record<string, ListVideoResponse>>((acc, row) => {
      if (!acc[row.video_id]) {
        acc[row.video_id] = {
          id: row.video_id,
          term: row.term,
          cover: row.cover,
          tags: row.tags?.split(","),
          files: [],
          status: {
            id: row.status_id,
            status: row.status,
            status_message: row.status_message,
          },
          updated_at: row.video_updated_at,
          created_at: row.video_created_at,
        };
      }

      if (row.file_id) {
        const fileExists = acc[row.video_id].files.some(
          (file) => file.id === row.file_id
        );

        if (!fileExists) {
          acc[row.video_id].files.push({
            id: row.file_id,
            cover_url: row.cover_url,
            video_url: row.video_url,
            width: row.width,
            height: row.height,
            size: row.size,
            type: row.type,
          });
        }
      }

      return acc;
    }, {});

    return {
      data: Object.values(videos),
      pagination: {
        total: Number(count),
        per_page: perPage,
        current_page: page,
        total_pages: Math.ceil(Number(count) / perPage),
      },
    };
  }

  async generate(term: string, id: string): Promise<string> {
    const videoFilePath = path.join(
      paths.results,
      id,
      "output_final_video.mp4"
    );

    try {
      await fs.promises.access(videoFilePath);
      return videoFilePath;
    } catch {
      throw new HttpError("Video not found");
    }
  }

  async delete(id: string): Promise<void> {
    const dir = path.join(paths.results, id);

    try {
      await fs.promises.rm(dir, { recursive: true, force: true });

      console.log(`${dir} is deleted!`);
    } catch (err) {
      console.error(`Error deleting directory: ${(err as Error).message}`);
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
      return videoFilePath;
    } catch {
      throw new HttpError("Video not found");
    }
  }
}

export const videoService = new VideoService();
