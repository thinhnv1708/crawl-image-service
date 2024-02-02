import { IRedisConfig } from '@configurations/interfaces';
import { makeRedisConfig } from '@helpers/makeRedisConfig.helper';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { CacheModule as CacheLibModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  AbstractAtomicLockManagerRepository,
  AbstractExternalCacheRepository,
} from './abstracts';
import { RedisLockAtomicManagerRepository } from './redisAtomicLockManager.repository';
import { RedisCacheRepository } from './redisCache.repository';

@Global()
@Module({
  imports: [
    CacheLibModule.register(),
    RedisModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisConfig>('REDIS_CONFIG');

        return makeRedisConfig(redisConfig);
      },
    }),
  ],
  providers: [
    {
      provide: AbstractExternalCacheRepository,
      useClass: RedisCacheRepository,
    },
    {
      provide: AbstractAtomicLockManagerRepository,
      useClass: RedisLockAtomicManagerRepository,
    },
  ],
  exports: [
    AbstractExternalCacheRepository,
    AbstractAtomicLockManagerRepository,
  ],
})
export class CacheModule {}
