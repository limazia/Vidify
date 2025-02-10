import { redisClient } from "@/shared/lib/redis";
import { ListParams, ListVideoResponse } from "@/shared/types/video";

export class CacheService {
  private static CACHE_PREFIX = "videos";
  private static DEFAULT_TTL = 3600; // 1 hour in seconds

  static generateCacheKey(params: ListParams): string {
    const { query, page, perPage, sortOrder } = params;
    return `${this.CACHE_PREFIX}:${query}:${page}:${perPage}:${sortOrder}`;
  }

  static generateWildcardPattern(): string {
    return `${this.CACHE_PREFIX}:*`;
  }

  static async getCache(key: string): Promise<ListVideoResponse | null> {
    const cachedResult = await redisClient.get(key);
    return cachedResult ? JSON.parse(cachedResult) : null;
  }

  static async setCache(
    key: string,
    data: ListVideoResponse,
    ttl: number = this.DEFAULT_TTL
  ): Promise<void> {
    await redisClient.setex(key, ttl, JSON.stringify(data));
  }

  static async invalidateCache(): Promise<void> {
    const pattern = this.generateWildcardPattern();
    const keys = await redisClient.keys(pattern);

    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  }
}
