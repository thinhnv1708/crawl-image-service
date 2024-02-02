export interface IRedisConfig {
  HOST: string;
  PORT: number;
  SENTINELS: {
    host: string;
    port: number;
  }[];
  CLUSTER_NAME: string;
  CLUSTER_PASSWORD: string;
  PASSWORD: string;
  DB: number;
  BASE_PREFIX: string;
}
