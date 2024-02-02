import { COMMONS } from '@constants/index';
import { AbstractAtomicLockManagerRepository } from '@modules/cache';
import { Injectable } from '@nestjs/common';
import { SleepUtil } from '@utils/sleep.util';
import { CrawlerJobGwAdp } from './crawlerJob.gw.adp';
import { CreateDirGwAdp } from './createDir.gw.adp';
import { DestinationPathGwAdp } from './destinationPath.gw.adp';
import { DowloadImageGwAdp } from './dowloadImage.gw.adp';
import { ImageCrawlRepository } from './imageCrawl.repository';
import { RemoveImageGwAdp } from './removeImage.gw.adp';
import { ResizeImageGwAdp } from './resizeImage.gw.adp';

@Injectable()
export class CrawlerService {
  constructor(
    private readonly dowloadImageGwAdp: DowloadImageGwAdp,
    private readonly resizeImageGwAdp: ResizeImageGwAdp,
    private readonly imageCrawlRepository: ImageCrawlRepository,
    private readonly destinationPathGwAdp: DestinationPathGwAdp,
    private readonly atomicLockManagerRepository: AbstractAtomicLockManagerRepository,
    private readonly sleepUtil: SleepUtil,
    private readonly crawlerJobGwAdp: CrawlerJobGwAdp,
    private readonly removeImageGwAdp: RemoveImageGwAdp,
    private readonly createDirGwAdp: CreateDirGwAdp,
  ) {}

  private async waitLocking(
    lockKey: string,
    lockingTimeoutSeconds: number,
  ): Promise<void> {
    const isLocking = await this.atomicLockManagerRepository.isLocking(
      lockKey,
      lockingTimeoutSeconds,
    );

    if (isLocking) {
      await this.sleepUtil.sleep(50);
      await this.waitLocking(lockKey, lockingTimeoutSeconds);
    }
  }

  async getFileImageName(
    source: string,
    category: string,
    fileType: string,
    width: number,
    height: number,
  ): Promise<string> {
    const lockingTimeoutSeconds = 20;
    await this.waitLocking(source, lockingTimeoutSeconds);

    const imageCrawl = await this.imageCrawlRepository.findImageCrawl(
      source,
      width,
      height,
    );

    if (imageCrawl) {
      this.atomicLockManagerRepository.clearLocking(source);
      return imageCrawl.ouput;
    }

    const destinationPath = this.destinationPathGwAdp.getDesticationPath(
      category,
      fileType,
    );

    const newImageCrawl = await this.imageCrawlRepository.createImageCrawl({
      ouput: destinationPath,
      source,
      width,
      height,
      state: COMMONS.STATES.PROCESSING,
    });

    this.crawlerJobGwAdp.addJob(source, destinationPath, width, height);
    this.atomicLockManagerRepository.clearLocking(source);

    return newImageCrawl.ouput;
  }

  private getDirectory(destinationPath: string): string {
    const destinationPathArray = destinationPath.split(/\\|\//g);
    destinationPathArray.pop();
    return destinationPathArray.join('/');
  }

  async handleCrawlImage(
    source: string,
    tempDestinationPath: string,
    destinationPath: string,
    width: number,
    height: number,
  ): Promise<void> {
    try {
      await this.imageCrawlRepository.upadteStateImageCrawl(
        source,
        width,
        height,
        COMMONS.STATES.PROCESSING,
        '',
      );

      const tempDestinationDirectory = this.getDirectory(tempDestinationPath);
      const destinationPathDirectory = this.getDirectory(destinationPath);

      this.createDirGwAdp.mkdir(tempDestinationDirectory);
      this.createDirGwAdp.mkdir(destinationPathDirectory);

      await this.dowloadImageGwAdp.dowloadImage(source, tempDestinationPath);

      await this.resizeImageGwAdp.resizeImage(
        tempDestinationPath,
        destinationPath,
        width,
        height,
      );

      this.removeImageGwAdp.remove(tempDestinationPath);

      await this.imageCrawlRepository.upadteStateImageCrawl(
        source,
        width,
        height,
        COMMONS.STATES.SUCCESS,
        '',
      );
    } catch (error) {
      await this.imageCrawlRepository.upadteStateImageCrawl(
        source,
        width,
        height,
        COMMONS.STATES.ERROR,
        error.message,
      );
    }
  }
}
