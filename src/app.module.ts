import { CrawlerModule } from '@modules/crawler';
import { LoggerModule } from '@modules/logger';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import {
  appConfig,
  loggerConfig,
  mongodbConfig,
  redisConfig,
} from './configurations';
import { MongooseModule } from '@modules/mongodb';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, loggerConfig, mongodbConfig, redisConfig],
      envFilePath: ['.development.env'],
    }),
    LoggerModule,
    MongooseModule,
    CrawlerModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
