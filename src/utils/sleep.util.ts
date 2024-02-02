import { Injectable } from '@nestjs/common';

@Injectable()
export class SleepUtil {
  async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
