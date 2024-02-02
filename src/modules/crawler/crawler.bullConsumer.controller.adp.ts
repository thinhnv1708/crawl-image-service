import { COMMONS } from '@constants/index';
import { Process, Processor } from '@nestjs/bull';
import { CrawlerService } from './crawler.service';
import { DoneCallback, Job } from 'bull';
import { excutePromise } from '@utils/excutePromise.util';
import { ConfigService } from '@nestjs/config';
import { IAppConfig } from '@configurations/interfaces';

@Processor(COMMONS.BULL_QUEUE_NAMES.CRAWL_IMAGE)
export class CrawlerBullConsumerControllerAdp {
  private uploadDestination: string;
  private tempDirectory = 'temp';

  constructor(
    private readonly configService: ConfigService,
    private readonly crawlerService: CrawlerService,
  ) {
    const { UPLOAD_DESTINATION } =
      this.configService.get<IAppConfig>('APP_CONFIG');

    this.uploadDestination = UPLOAD_DESTINATION;
  }

  @Process()
  async handleCrawlImage(
    job: Job<{
      source: string;
      destinationPath: string;
      width: number;
      height: number;
    }>,
    done: DoneCallback,
  ): Promise<void> {
    const { source, destinationPath, width, height } = job.data;
    await excutePromise(
      this.crawlerService.handleCrawlImage(
        source,
        `${this.uploadDestination}/${this.tempDirectory}${destinationPath}`,
        `${this.uploadDestination}${destinationPath}`,
        width || undefined,
        height || undefined,
      ),
    );

    return done();
  }
}
