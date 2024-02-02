import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { IImageCrawl } from '../interfaces';

export type ImageCrawlDocument = ImageCrawl & Document;
export const ImageCrawlCollectionName = 'ImageCrawl';

@Schema({
  timestamps: true,
  collection: ImageCrawlCollectionName,
  versionKey: false,
})
export class ImageCrawl extends Document implements IImageCrawl {
  @Prop({ type: String })
  source: string;

  @Prop({ type: String })
  ouput: string;

  @Prop({ type: Number })
  width: number;

  @Prop({ type: Number })
  height: number;

  @Prop({ type: String })
  state: string;

  @Prop({ type: String })
  message: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

const _Schema = SchemaFactory.createForClass(ImageCrawl);
_Schema.index({ source: 1, width: 1, height: 1 }, { unique: true });

export const ImageCrawlSchema = _Schema;
