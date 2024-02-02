import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { AbstractMemoryCacheRepository } from './abstracts';

@Injectable()
export class MemoryCacheRepository implements AbstractMemoryCacheRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  get<T>(key: string): Promise<T> {
    return this.cacheManager.get<T>(key);
  }

  async set<T>(key: string, value: T, ttlSeconds: number = 0): Promise<void> {
    if (!ttlSeconds) {
      await this.cacheManager.set(key, value);
    }

    await this.cacheManager.set(key, value, ttlSeconds * 1000);
  }

  async del(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }
}
