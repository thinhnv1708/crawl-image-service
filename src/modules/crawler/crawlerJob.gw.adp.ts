import { COMMONS } from '@constants/index';
import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class CrawlerJobGwAdp {
  constructor(
    @InjectQueue(COMMONS.BULL_QUEUE_NAMES.CRAWL_IMAGE) private queue: Queue,
  ) {}

  async addJob(
    source: string,
    destinationPath: string,
    width: number,
    height: number,
  ): Promise<void> {
    await this.queue.add(
      { source, destinationPath, width, height },
      { jobId: source, removeOnComplete: true },
    );
  }
}
