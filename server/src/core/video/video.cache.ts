/*
import { redisClient } from "@/shared/lib/redis";
import { CompaniesResponse, PaginationRequest } from "@model/Company";

export class CompanyCacheService {
  private static CACHE_PREFIX = "companies";
  private static DEFAULT_TTL = 3600; // 1 hour in seconds

  static generateCacheKey(params: PaginationRequest): string {
    const { query, page, perPage, sortOrder } = params;
    return `${this.CACHE_PREFIX}:${query}:${page}:${perPage}:${sortOrder}`;
  }

  static generateWildcardPattern(): string {
    return `${this.CACHE_PREFIX}:*`;
  }

  static async getCache(key: string): Promise<CompaniesResponse | null> {
    const cachedResult = await redisClient.get(key);
    return cachedResult ? JSON.parse(cachedResult) : null;
  }

  static async setCache(
    key: string,
    data: CompaniesResponse,
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
*/