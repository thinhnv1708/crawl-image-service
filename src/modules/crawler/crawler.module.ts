import { IRedisConfig } from '@configurations/interfaces';
import { COMMONS } from '@constants/index';
import { makeBullConfig } from '@helpers/index';
import { CacheModule } from '@modules/cache';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SleepUtil } from '@utils/sleep.util';
import { CrawlerBullConsumerControllerAdp } from './crawler.bullConsumer.controller.adp';
import { CrawlerRestControllerAdp } from './crawler.rest.controller.adp';
import { CrawlerService } from './crawler.service';
import { CrawlerJobGwAdp } from './crawlerJob.gw.adp';
import { CreateDirGwAdp } from './createDir.gw.adp';
import { DestinationPathGwAdp } from './destinationPath.gw.adp';
import { DowloadImageGwAdp } from './dowloadImage.gw.adp';
import { ImageCrawlRepository } from './imageCrawl.repository';
import { ImageCrawl, ImageCrawlSchema } from './mongooseSchemas';
import { RemoveImageGwAdp } from './removeImage.gw.adp';
import { ResizeImageGwAdp } from './resizeImage.gw.adp';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ImageCrawl.name, schema: ImageCrawlSchema },
    ]),
    HttpModule,
    CacheModule,
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisConfig = configService.get<IRedisConfig>('REDIS_CONFIG');

        return {
          redis: makeBullConfig(redisConfig),
          prefix: redisConfig.BASE_PREFIX,
        };
      },
    }),
    BullModule.registerQueue({ name: COMMONS.BULL_QUEUE_NAMES.CRAWL_IMAGE }),
  ],
  controllers: [CrawlerRestControllerAdp],
  providers: [
    DestinationPathGwAdp,
    DowloadImageGwAdp,
    ResizeImageGwAdp,
    ImageCrawlRepository,
    CrawlerService,
    SleepUtil,
    CrawlerJobGwAdp,
    CrawlerBullConsumerControllerAdp,
    RemoveImageGwAdp,
    CreateDirGwAdp,
  ],
})
export class CrawlerModule {}
