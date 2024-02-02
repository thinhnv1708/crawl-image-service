import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { AbstractAtomicLockManagerRepository } from './abstracts';

@Injectable()
export class RedisLockAtomicManagerRepository
  implements AbstractAtomicLockManagerRepository
{
  private lockKeyPrefix = 'lock:';

  constructor(@InjectRedis() private readonly redis: Redis) {}

  async isLocking(
    lockKey: string,
    lockingTimeoutSeconds: number,
  ): Promise<boolean> {
    const isLocking = await this.redis.set(
      `${this.lockKeyPrefix}:${lockKey}`,
      '1',
      'EX',
      lockingTimeoutSeconds,
      'NX',
    );

    return isLocking !== 'OK';
  }

  async clearLocking(lockKey: string): Promise<boolean> {
    const isLocking = await this.redis.del(`${this.lockKeyPrefix}:${lockKey}`);

    return isLocking === 1;
  }
}
