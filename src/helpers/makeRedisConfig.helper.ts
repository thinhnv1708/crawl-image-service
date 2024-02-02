import { IRedisConfig } from '@configurations/interfaces';
import { RedisModuleOptions } from '@liaoliaots/nestjs-redis';

export const makeRedisConfig = (
  redisConfig: IRedisConfig,
): RedisModuleOptions => {
  const {
    HOST,
    PORT,
    SENTINELS,
    CLUSTER_NAME,
    CLUSTER_PASSWORD,
    DB,
    BASE_PREFIX,
  } = redisConfig;

  if (SENTINELS) {
    return {
      config: {
        sentinels: SENTINELS,
        name: CLUSTER_NAME,
        password: CLUSTER_PASSWORD,
        db: DB,
        keyPrefix: BASE_PREFIX,
      },
    };
  } else {
    return {
      config: {
        host: HOST,
        port: PORT,
        db: DB,
        keyPrefix: BASE_PREFIX,
      },
    };
  }
};
