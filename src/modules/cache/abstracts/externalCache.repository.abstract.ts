export abstract class AbstractExternalCacheRepository {
  abstract get(key: string): Promise<string>;
  abstract mget(...keys: string[]): Promise<string[]>;
  abstract set(key: string, value: string, ttlSeconds: number): Promise<void>;
  abstract del(key: string): Promise<void>;
}
