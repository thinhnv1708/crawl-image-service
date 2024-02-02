export abstract class AbstractAtomicLockManagerRepository {
  abstract isLocking(
    lockKey: string,
    lockingTimeoutSeconds: number,
  ): Promise<boolean>;
  abstract clearLocking(lockKey: string): Promise<boolean>;
}
