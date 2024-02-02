import { IRedisConfig } from '@configurations/interfaces';

export const makeBullConfig = (redisConfig: IRedisConfig) => {
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
      sentinels: SENTINELS,
      name: CLUSTER_NAME,
      password: CLUSTER_PASSWORD,
      db: DB,
      keyPrefix: BASE_PREFIX,
    };
  } else {
    return {
      host: HOST,
      port: PORT,
      db: DB,
      keyPrefix: BASE_PREFIX,
    };
  }
};
