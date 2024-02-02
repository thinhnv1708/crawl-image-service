import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICreateImageCrawlData, IImageCrawl } from './interfaces';
import { ImageCrawl, ImageCrawlDocument } from './mongooseSchemas';

@Injectable()
export class ImageCrawlRepository {
  constructor(
    @InjectModel(ImageCrawl.name)
    private readonly imageCrawlModel: Model<ImageCrawlDocument>,
  ) {}

  async findImageCrawl(
    source: string,
    width: number,
    height: number,
  ): Promise<IImageCrawl> {
    const sourceDocument = await this.imageCrawlModel
      .findOne({ source, width, height })
      .lean();

    return sourceDocument;
  }

  async createImageCrawl(data: ICreateImageCrawlData): Promise<IImageCrawl> {
    const sourceDocument = await this.imageCrawlModel.create(data);

    return sourceDocument.toObject();
  }

  async upadteStateImageCrawl(
    source: string,
    width: number,
    height: number,
    state: string,
    message: string,
  ): Promise<IImageCrawl> {
    const sourceDocument = await this.imageCrawlModel
      .findOneAndUpdate({ source, width, height }, { state, message })
      .lean();

    return sourceDocument;
  }
}
