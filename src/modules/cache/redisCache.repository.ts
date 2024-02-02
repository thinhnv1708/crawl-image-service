import { Injectable } from '@nestjs/common';
import { AbstractExternalCacheRepository } from './abstracts';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheRepository implements AbstractExternalCacheRepository {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  async mget(...keys: string[]): Promise<string[]> {
    return this.redis.mget(...keys);
  }

  async get(key: string): Promise<string> {
    const value = await this.redis.get(key);
    return value;
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }
}
